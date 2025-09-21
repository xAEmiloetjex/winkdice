var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncSubject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LocationService } from 'app/shared/location.service';
import { Logger } from 'app/shared/logger.service';
export const FILE_NOT_FOUND_ID = 'file-not-found';
export const FETCHING_ERROR_ID = 'fetching-error';
export const CONTENT_URL_PREFIX = 'generated/';
export const DOC_CONTENT_URL_PREFIX = CONTENT_URL_PREFIX + 'docs/';
const FETCHING_ERROR_CONTENTS = (path) => `
  <div class="nf-container l-flex-wrap flex-center">
    <div class="nf-icon material-icons">error_outline</div>
    <div class="nf-response l-flex-wrap">
      <h1 class="no-toc">Request for document failed.</h1>
      <p>
        We are unable to retrieve the "${path}" page at this time.
        Please check your connection and try again later.
      </p>
    </div>
  </div>
`;
let DocumentService = class DocumentService {
    logger;
    http;
    cache = new Map();
    currentDocument;
    constructor(logger, http, location) {
        this.logger = logger;
        this.http = http;
        // Whenever the URL changes we try to get the appropriate doc
        this.currentDocument = location.currentPath.pipe(switchMap(path => this.getDocument(path)));
    }
    getDocument(url) {
        const id = url || 'index';
        this.logger.log('getting document', id);
        if (!this.cache.has(id)) {
            this.cache.set(id, this.fetchDocument(id));
        }
        return this.cache.get(id);
    }
    fetchDocument(id) {
        const requestPath = `${DOC_CONTENT_URL_PREFIX}${id}.json`;
        const subject = new AsyncSubject();
        this.logger.log('fetching document from', requestPath);
        this.http
            .get(requestPath, { responseType: 'json' })
            .pipe(tap(data => {
            if (!data || typeof data !== 'object') {
                this.logger.log('received invalid data:', data);
                throw Error('Invalid data');
            }
        }), catchError((error) => error.status === 404 ? this.getFileNotFoundDoc(id) : this.getErrorDoc(id, error)))
            .subscribe(subject);
        return subject.asObservable();
    }
    getFileNotFoundDoc(id) {
        if (id !== FILE_NOT_FOUND_ID) {
            this.logger.error(new Error(`Document file not found at '${id}'`));
            // using `getDocument` means that we can fetch the 404 doc contents from the server and cache it
            return this.getDocument(FILE_NOT_FOUND_ID);
        }
        else {
            return of({
                id: FILE_NOT_FOUND_ID,
                contents: 'Document not found'
            });
        }
    }
    getErrorDoc(id, error) {
        this.logger.error(new Error(`Error fetching document '${id}': (${error.message})`));
        this.cache.delete(id);
        return of({
            id: FETCHING_ERROR_ID,
            contents: FETCHING_ERROR_CONTENTS(id),
        });
    }
};
DocumentService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Logger, typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object, LocationService])
], DocumentService);
export { DocumentService };
