/* eslint-env worker */
/// <reference lib="webworker" />
import * as lunr from 'lunr';

import { WebWorkerMessage } from '../shared/web-worker-message';

const SEARCH_TERMS_URL = '/generated/docs/app/search-data.json';
let index: lunr.Index;
const pageMap: SearchInfo = {};

interface SearchInfo {
  [key: string]: PageInfo;
}

interface PageInfo {
  path: string;
  type: string;
  title: string;
  headings: string;
  keywords: string;
  members: string;
  topics: string;
}

interface EncodedPages {
  dictionary: string;
  pages: EncodedPage[];
}

interface EncodedPage {
  path: string;
  type: string;
  title: string;
  headings: number[];
  keywords: number[];
  members: number[];
  topics: string;
}

addEventListener('message', handleMessage);

const customLunr = function(config: lunr.ConfigFunction) {
  const builder = new lunr.Builder();
  builder.pipeline.add(lunr.trimmer, lunr.stemmer);
  builder.searchPipeline.add(lunr.stemmer);
  config.call(builder, builder);
  return builder.build();
};

// Create the lunr index - the docs should be an array of objects, each object containing
// the path and search terms for a page
function createIndex(loadIndexFn: IndexLoader): lunr.Index {
  // The lunr typings are missing QueryLexer so we have to add them here manually.
  const queryLexer = (lunr as any as { QueryLexer: { termSeparator: RegExp } }).QueryLexer;
  queryLexer.termSeparator = lunr.tokenizer.separator = /\s+/;
  return customLunr(function() {
    this.ref('path');
    this.field('topics', { boost: 15 });
    this.field('title', { boost: 10 });
    this.field('headings', { boost: 5 });
    this.field('members', { boost: 4 });
    this.field('keywords', { boost: 2 });
    loadIndexFn(this);
  });
}

// The worker receives a message to load the index and to query the index
function handleMessage(message: { data: WebWorkerMessage }): void {
  const type = message.data.type;
  const id = message.data.id;
  const payload = message.data.payload;
  switch (type) {
    case 'load-index':
      makeRequest(SEARCH_TERMS_URL, (encodedPages: EncodedPages) => {
        index = createIndex(loadIndex(encodedPages));
        postMessage({ type, id, payload: true });
      });
      break;
    case 'query-index':
      postMessage({ type, id, payload: { query: payload, results: queryIndex(payload) } });
      break;
    default:
      postMessage({ type, id, payload: { error: 'invalid message type' } });
  }
}

// Use XHR to make a request to the server
function makeRequest(url: string, callback: (response: any) => void): void {
  // The JSON file that is loaded should be an array of PageInfo:
  const searchDataRequest = new XMLHttpRequest();
  searchDataRequest.onload = function() {
    callback(JSON.parse(this.responseText));
  };
  searchDataRequest.open('GET', url);
  searchDataRequest.send();
}

// Create the search index from the searchInfo which contains the information about each page to be
// indexed
function loadIndex({ dictionary, pages }: EncodedPages): IndexLoader {
  const dictionaryArray = dictionary.split(' ');
  return (indexBuilder: lunr.Builder) => {
    // Store the pages data to be used in mapping query results back to pages
    // Add search terms from each page to the search index
    pages.forEach((encodedPage) => {
      const page = decodePage(encodedPage, dictionaryArray);
      indexBuilder.add(page);
      pageMap[page.path] = page;
    });
  };
}

function decodePage(encodedPage: EncodedPage, dictionary: string[]): PageInfo {
  return {
    ...encodedPage,
    headings: encodedPage.headings?.map((i) => dictionary[i]).join(' ') ?? '',
    keywords: encodedPage.keywords?.map((i) => dictionary[i]).join(' ') ?? '',
    members: encodedPage.members?.map((i) => dictionary[i]).join(' ') ?? '',
  };
}

// Query the index and return the processed results
function queryIndex(query: string): PageInfo[] {
  // Strip off quotes
  query = query.replace(/^["']|['"]$/g, '');
  try {
    if (query.length) {
      let results = index.query((queryBuilder) => {
        queryBuilder.term(lunr.tokenizer(query), {
          fields: ['title'],
          // eslint-disable-next-line no-bitwise
          wildcard: lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING,
          usePipeline: true,
          presence: lunr.Query.presence.REQUIRED,
        });
      });

      if (results.length === 0) {
        // First try a query where every term must be present
        // (see https://lunrjs.com/guides/searching.html#term-presence)
        results = index.query((queryBuilder) => {
          const tokens = lunr.tokenizer(query);
          for (const token of tokens) {
            queryBuilder.term(token, {
              usePipeline: true,
              presence: lunr.Query.presence.REQUIRED,
            });
          }
        });
      }

      // If that was too restrictive just query for any term to be present
      if (results.length === 0) {
        results = index.search(query);
      }

      // If that is still too restrictive then search in the title for the first word in the query
      if (results.length === 0) {
        // E.g. if the search is "ngCont guide" then we search for "ngCont guide title:*ngCont*"
        const titleQuery = 'title:*' + query.split(' ', 1)[0] + '*';
        results = index.search(query + ' ' + titleQuery);
      }

      // Map the hits into info about each page to be returned as results
      return results.map((hit) => pageMap[hit.ref]);
    }
  } catch (e) {
    // If the search query cannot be parsed the index throws an error
    // Log it and recover
    console.error(e);
  }
  return [];
}

type IndexLoader = (indexBuilder: lunr.Builder) => void;
