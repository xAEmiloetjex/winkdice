/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
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
import { NgZone, Injectable } from '@angular/core';
import { race, ReplaySubject, timer } from 'rxjs';
import { concatMap, first, publishReplay } from 'rxjs/operators';
import { WebWorkerClient } from 'app/shared/web-worker';
let SearchService = class SearchService {
    zone;
    ready;
    searchesSubject = new ReplaySubject(1);
    worker;
    constructor(zone) {
        this.zone = zone;
    }
    /**
     * Initialize the search engine. We offer an `initDelay` to prevent the search initialisation from delaying the
     * initial rendering of the web page. Triggering a search will override this delay and cause the index to be
     * loaded immediately.
     *
     * @param initDelay the number of milliseconds to wait before we load the WebWorker and generate the search index
     */
    initWorker(initDelay) {
        // Wait for the initDelay or the first search
        const ready = (this.ready = race(timer(initDelay), this.searchesSubject.asObservable().pipe(first())).pipe(concatMap(() => {
            // Create the worker and load the index
            const worker = new Worker(new URL('./search.worker', import.meta.url), { type: 'module' });
            this.worker = WebWorkerClient.create(worker, this.zone);
            return this.worker.sendMessage('load-index');
        }), publishReplay(1)));
        // Connect to the observable to kick off the timer
        ready.connect();
        return ready;
    }
    /**
     * Search the index using the given query and emit results on the observable that is returned.
     *
     * @param query The query to run against the index.
     * @returns an observable collection of search results
     */
    search(query) {
        // Trigger the searches subject to override the init delay timer
        this.searchesSubject.next(query);
        // Once the index has loaded, switch to listening to the searches coming in.
        return this.ready.pipe(concatMap(() => this.worker.sendMessage('query-index', query)));
    }
};
SearchService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object])
], SearchService);
export { SearchService };
