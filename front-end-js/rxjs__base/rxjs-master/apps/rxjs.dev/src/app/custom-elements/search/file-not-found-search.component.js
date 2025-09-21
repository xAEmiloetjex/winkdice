var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { LocationService } from 'app/shared/location.service';
import { SearchService } from 'app/search/search.service';
let FileNotFoundSearchComponent = class FileNotFoundSearchComponent {
    location;
    search;
    searchResults;
    constructor(location, search) {
        this.location = location;
        this.search = search;
    }
    ngOnInit() {
        this.searchResults = this.location.currentPath.pipe(switchMap(path => {
            const query = path.split(/\W+/).join(' ');
            return this.search.search(query);
        }));
    }
};
FileNotFoundSearchComponent = __decorate([
    Component({
        selector: 'aio-file-not-found-search',
        template: `<p>Let's see if any of these search results help...</p>
  <aio-search-results class="embedded" [searchResults]="searchResults | async"></aio-search-results>`
    }),
    __metadata("design:paramtypes", [LocationService, SearchService])
], FileNotFoundSearchComponent);
export { FileNotFoundSearchComponent };
