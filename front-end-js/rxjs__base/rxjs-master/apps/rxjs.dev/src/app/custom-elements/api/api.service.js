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
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Logger } from 'app/shared/logger.service';
import { DOC_CONTENT_URL_PREFIX } from 'app/documents/document.service';
let ApiService = class ApiService {
    http;
    logger;
    apiBase = DOC_CONTENT_URL_PREFIX + 'api/';
    apiListJsonDefault = 'api-list.json';
    firstTime = true;
    onDestroy = new Subject();
    sectionsSubject = new ReplaySubject(1);
    _sections = this.sectionsSubject.pipe(takeUntil(this.onDestroy));
    /**
     * Return a cached observable of API sections from a JSON file.
     * API sections is an array of Angular top modules and metadata about their API documents (items).
     */
    get sections() {
        if (this.firstTime) {
            this.firstTime = false;
            this.fetchSections(); // TODO: get URL for fetchSections by configuration?
            // makes sectionsSubject hot; subscribe ensures stays alive (always refCount > 0);
            this._sections.subscribe(() => this.logger.log('ApiService got API sections'));
        }
        return this._sections.pipe(tap(sections => {
            sections.forEach(section => {
                section.deprecated = !!section.items &&
                    section.items.every(item => item.stability === 'deprecated');
            });
        }));
    }
    constructor(http, logger) {
        this.http = http;
        this.logger = logger;
    }
    ngOnDestroy() {
        this.onDestroy.next(null);
    }
    /**
     * Fetch API sections from a JSON file.
     * API sections is an array of Angular top modules and metadata about their API documents (items).
     * Updates `sections` observable
     *
     * @param src Name of the api list JSON file
     */
    fetchSections(src) {
        // TODO: get URL by configuration?
        const url = this.apiBase + (src || this.apiListJsonDefault);
        this.http.get(url)
            .pipe(takeUntil(this.onDestroy), tap(() => this.logger.log(`Got API sections from ${url}`)))
            .subscribe(sections => this.sectionsSubject.next(sections), (err) => {
            // TODO: handle error
            this.logger.error(err);
            throw err; // rethrow for now.
        });
    }
};
ApiService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object, Logger])
], ApiService);
export { ApiService };
