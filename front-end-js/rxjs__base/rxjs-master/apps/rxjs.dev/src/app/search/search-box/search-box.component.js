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
import { Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { LocationService } from 'app/shared/location.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
let SearchBoxComponent = class SearchBoxComponent {
    locationService;
    searchDebounce = 300;
    searchSubject = new Subject();
    searchBox;
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    onSearch = this.searchSubject.pipe(distinctUntilChanged(), debounceTime(this.searchDebounce));
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    onFocus = new EventEmitter();
    constructor(locationService) {
        this.locationService = locationService;
    }
    /**
     * When we first show this search box we trigger a search if there is a search query in the URL
     */
    ngOnInit() {
        const query = this.locationService.search().search;
        if (query) {
            this.query = query;
            this.doSearch();
        }
    }
    doSearch() {
        this.searchSubject.next(this.query);
    }
    doFocus() {
        this.onFocus.emit(this.query);
    }
    focus() {
        this.searchBox.nativeElement.focus();
    }
    get query() { return this.searchBox.nativeElement.value; }
    set query(value) { this.searchBox.nativeElement.value = value; }
};
__decorate([
    ViewChild('searchBox', { static: true }),
    __metadata("design:type", typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object)
], SearchBoxComponent.prototype, "searchBox", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], SearchBoxComponent.prototype, "onSearch", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], SearchBoxComponent.prototype, "onFocus", void 0);
SearchBoxComponent = __decorate([
    Component({
        selector: 'aio-search-box',
        template: `<input #searchBox
    type="search"
    aria-label="search"
    placeholder="Search"
    (input)="doSearch()"
    (keyup)="doSearch()"
    (focus)="doFocus()"
    (click)="doSearch()">`
    }),
    __metadata("design:paramtypes", [LocationService])
], SearchBoxComponent);
export { SearchBoxComponent };
