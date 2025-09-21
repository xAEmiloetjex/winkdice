/*
 * API List & Filter Component
 *
 * A page that displays a formatted list of the public Angular API entities.
 * Clicking on a list item triggers navigation to the corresponding API entity document.
 * Can add/remove API entity links based on filter settings.
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
import { Component, ElementRef, ViewChild } from '@angular/core';
import { combineLatest, ReplaySubject } from 'rxjs';
import { LocationService } from 'app/shared/location.service';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
class SearchCriteria {
    query = '';
    status = 'all';
    type = 'all';
}
let ApiListComponent = class ApiListComponent {
    apiService;
    locationService;
    filteredSections;
    showStatusMenu = false;
    showTypeMenu = false;
    criteriaSubject = new ReplaySubject(1);
    searchCriteria = new SearchCriteria();
    status;
    type;
    // API types
    types = [
        { value: 'all', title: 'All' },
        { value: 'class', title: 'Class' },
        { value: 'const', title: 'Const' },
        { value: 'enum', title: 'Enum' },
        { value: 'function', title: 'Function' },
        { value: 'interface', title: 'Interface' },
        { value: 'type-alias', title: 'Type alias' },
    ];
    statuses = [
        { value: 'all', title: 'All' },
        { value: 'deprecated', title: 'Deprecated' },
        { value: 'security-risk', title: 'Security Risk' },
    ];
    queryEl;
    constructor(apiService, locationService) {
        this.apiService = apiService;
        this.locationService = locationService;
    }
    ngOnInit() {
        this.filteredSections = combineLatest(this.apiService.sections, this.criteriaSubject).pipe(map((results) => ({ sections: results[0], criteria: results[1] })), map((results) => results.sections.map((section) => ({ ...section, items: this.filterSection(section, results.criteria) }))));
        this.initializeSearchCriteria();
    }
    // TODO: may need to debounce as the original did
    // although there shouldn't be any perf consequences if we don't
    setQuery(query) {
        this.setSearchCriteria({ query: (query || '').toLowerCase().trim() });
    }
    setStatus(status) {
        this.toggleStatusMenu();
        this.status = status;
        this.setSearchCriteria({ status: status.value });
    }
    setType(type) {
        this.toggleTypeMenu();
        this.type = type;
        this.setSearchCriteria({ type: type.value });
    }
    toggleStatusMenu() {
        this.showStatusMenu = !this.showStatusMenu;
    }
    toggleTypeMenu() {
        this.showTypeMenu = !this.showTypeMenu;
    }
    //////// Private //////////
    filterSection(section, { query, status, type }) {
        const items = section.items.filter((item) => {
            return matchesType() && matchesStatus() && matchesQuery();
            function matchesQuery() {
                return !query || section.name.indexOf(query) !== -1 || item.name.indexOf(query) !== -1;
            }
            function matchesStatus() {
                return status === 'all' || status === item.stability || (status === 'security-risk' && item.securityRisk);
            }
            function matchesType() {
                return type === 'all' || type === item.docType;
            }
        });
        // If there are no items we still return an empty array if the section name matches and the type is 'package'
        return items.length ? items : type === 'package' && (!query || section.name.indexOf(query) !== -1) ? [] : null;
    }
    // Get initial search criteria from URL search params
    initializeSearchCriteria() {
        const { query, status, type } = this.locationService.search();
        const q = (query || '').toLowerCase();
        // Hack: can't bind to query because input cursor always forced to end-of-line.
        this.queryEl.nativeElement.value = q;
        this.status = this.statuses.find((x) => x.value === status) || this.statuses[0];
        this.type = this.types.find((x) => x.value === type) || this.types[0];
        this.searchCriteria = {
            query: q,
            status: this.status.value,
            type: this.type.value,
        };
        this.criteriaSubject.next(this.searchCriteria);
    }
    setLocationSearch() {
        const { query, status, type } = this.searchCriteria;
        const params = {
            query: query ? query : undefined,
            status: status !== 'all' ? status : undefined,
            type: type !== 'all' ? type : undefined,
        };
        this.locationService.setSearch('API Search', params);
    }
    setSearchCriteria(criteria) {
        this.criteriaSubject.next(Object.assign(this.searchCriteria, criteria));
        this.setLocationSearch();
    }
};
__decorate([
    ViewChild('filter', { static: true }),
    __metadata("design:type", typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object)
], ApiListComponent.prototype, "queryEl", void 0);
ApiListComponent = __decorate([
    Component({
        selector: 'aio-api-list',
        template: `<div class="l-flex-wrap api-filter">
      <aio-select (change)="setType($event.option)" [options]="types" [selected]="type" [showSymbol]="true" label="Type:"> </aio-select>

      <div class="form-search">
        <input #filter placeholder="Filter" aria-label="Filter" (input)="setQuery(filter.value)" />
        <i class="material-icons">search</i>
      </div>
    </div>

    <article class="api-list-container l-content-small docs-content">
      <div *ngFor="let section of filteredSections | async">
        <h2 [id]="section.title" *ngIf="section.items">{{ section.title }}</h2>
        <ul class="api-list" *ngIf="section.items?.length">
          <ng-container *ngFor="let item of section.items">
            <li class="api-item">
              <a [href]="item.path">
                <span class="symbol {{ item.docType }}"></span>
                <span class="stability {{ item.stability }}"
                  >{{ item.title }} {{ !item.stability || item.stability === 'stable' ? '' : '(' + item.stability + ')' }}</span
                >
              </a>
            </li>
          </ng-container>
        </ul>
      </div>
    </article> `,
    }),
    __metadata("design:paramtypes", [ApiService, LocationService])
], ApiListComponent);
export { ApiListComponent };
