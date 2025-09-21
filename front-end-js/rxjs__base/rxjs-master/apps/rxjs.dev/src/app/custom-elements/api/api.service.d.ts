import { OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from 'app/shared/logger.service';
export interface ApiItem {
    name: string;
    title: string;
    path: string;
    docType: string;
    stability: string;
    securityRisk: boolean;
}
export interface ApiSection {
    path: string;
    name: string;
    title: string;
    deprecated: boolean;
    items: ApiItem[] | null;
}
export declare class ApiService implements OnDestroy {
    private http;
    private logger;
    private apiBase;
    private apiListJsonDefault;
    private firstTime;
    private onDestroy;
    private sectionsSubject;
    private _sections;
    /**
     * Return a cached observable of API sections from a JSON file.
     * API sections is an array of Angular top modules and metadata about their API documents (items).
     */
    get sections(): any;
    constructor(http: HttpClient, logger: Logger);
    ngOnDestroy(): void;
    /**
     * Fetch API sections from a JSON file.
     * API sections is an array of Angular top modules and metadata about their API documents (items).
     * Updates `sections` observable
     *
     * @param src Name of the api list JSON file
     */
    fetchSections(src?: string): void;
}
