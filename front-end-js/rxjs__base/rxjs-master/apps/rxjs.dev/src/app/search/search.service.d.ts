import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResults } from 'app/search/interfaces';
export declare class SearchService {
    private zone;
    private ready;
    private searchesSubject;
    private worker;
    constructor(zone: NgZone);
    /**
     * Initialize the search engine. We offer an `initDelay` to prevent the search initialisation from delaying the
     * initial rendering of the web page. Triggering a search will override this delay and cause the index to be
     * loaded immediately.
     *
     * @param initDelay the number of milliseconds to wait before we load the WebWorker and generate the search index
     */
    initWorker(initDelay: number): any;
    /**
     * Search the index using the given query and emit results on the observable that is returned.
     *
     * @param query The query to run against the index.
     * @returns an observable collection of search results
     */
    search(query: string): Observable<SearchResults>;
}
