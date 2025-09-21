import { OnInit, ElementRef } from '@angular/core';
import { LocationService } from 'app/shared/location.service';
/**
 * This component provides a text box to type a search query that will be sent to the SearchService.
 *
 * When you arrive at a page containing this component, it will retrieve the `query` from the browser
 * address bar. If there is a query then this will be made.
 *
 * Focussing on the input box will resend whatever query is there. This can be useful if the search
 * results had been hidden for some reason.
 *
 */
export declare class SearchBoxComponent implements OnInit {
    private locationService;
    private searchDebounce;
    private searchSubject;
    searchBox: ElementRef;
    onSearch: any;
    onFocus: any;
    constructor(locationService: LocationService);
    /**
     * When we first show this search box we trigger a search if there is a search query in the URL
     */
    ngOnInit(): void;
    doSearch(): void;
    doFocus(): void;
    focus(): void;
    private get query();
    private set query(value);
}
