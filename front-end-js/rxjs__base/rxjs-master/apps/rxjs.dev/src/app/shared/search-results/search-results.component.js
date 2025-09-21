var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * A component to display search results in groups
 */
let SearchResultsComponent = class SearchResultsComponent {
    /**
     * The results to display
     */
    searchResults;
    /**
     * Emitted when the user selects a search result
     */
    resultSelected = new EventEmitter();
    defaultArea = 'other';
    notFoundMessage = 'Searching ...';
    topLevelFolders = ['guide', 'tutorial'];
    searchAreas = [];
    ngOnChanges() {
        this.searchAreas = this.searchResults ? this.processSearchResults(this.searchResults) : [];
    }
    onResultSelected(page, event) {
        // Emit a `resultSelected` event if the result is to be displayed on this page.
        if (event.button === 0 && !event.ctrlKey && !event.metaKey) {
            this.resultSelected.emit(page);
        }
    }
    // Map the search results into groups by area
    processSearchResults(search) {
        if (!search) {
            return [];
        }
        this.notFoundMessage = 'No results found.';
        const searchAreaMap = {};
        search.results.forEach((result) => {
            if (!result.title) {
                return;
            } // bad data; should fix
            const areaName = this.computeAreaName(result) || this.defaultArea;
            const area = (searchAreaMap[areaName] = searchAreaMap[areaName] || []);
            area.push(result);
        });
        const keys = Object.keys(searchAreaMap).sort((l, r) => (l > r ? 1 : -1));
        return keys.map((name) => {
            let pages = searchAreaMap[name];
            // Extract the top 5 most relevant results as priorityPages
            const priorityPages = pages.splice(0, 5);
            pages = pages.sort(compareResults);
            return { name, pages, priorityPages };
        });
    }
    // Split the search result path and use the top level folder, if there is one, as the area name.
    computeAreaName(result) {
        if (this.topLevelFolders.indexOf(result.path) !== -1) {
            return result.path;
        }
        const [areaName, rest] = result.path.split('/', 2);
        return rest && areaName;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], SearchResultsComponent.prototype, "searchResults", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], SearchResultsComponent.prototype, "resultSelected", void 0);
SearchResultsComponent = __decorate([
    Component({
        selector: 'aio-search-results',
        template: `<div class="search-results">
      <div *ngIf="searchAreas.length; then searchResults; else notFound"></div>
    </div>

    <ng-template #searchResults>
      <h2 class="visually-hidden">Search Results</h2>
      <div class="search-area" *ngFor="let area of searchAreas">
        <h3>{{ area.name }} ({{ area.pages.length + area.priorityPages.length }})</h3>
        <ul class="priority-pages">
          <li class="search-page" *ngFor="let page of area.priorityPages">
            <a class="search-result-item" href="{{ page.path }}" (click)="onResultSelected(page, $event)">
              <span class="symbol {{ page.type }}" *ngIf="area.name === 'api'"></span>{{ page.title }}
            </a>
          </li>
        </ul>
        <ul>
          <li class="search-page" *ngFor="let page of area.pages">
            <a class="search-result-item" href="{{ page.path }}" (click)="onResultSelected(page, $event)">
              <span class="symbol {{ page.type }}" *ngIf="area.name === 'api'"></span>{{ page.title }}
            </a>
          </li>
        </ul>
      </div>
    </ng-template>

    <ng-template #notFound>
      <p>{{ notFoundMessage }}</p>
    </ng-template>`,
    })
], SearchResultsComponent);
export { SearchResultsComponent };
function compareResults(l, r) {
    return l.title.toUpperCase() > r.title.toUpperCase() ? 1 : -1;
}
