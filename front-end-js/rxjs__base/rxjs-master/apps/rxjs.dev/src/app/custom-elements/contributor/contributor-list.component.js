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
import { ContributorService } from './contributor.service';
import { LocationService } from 'app/shared/location.service';
let ContributorListComponent = class ContributorListComponent {
    contributorService;
    locationService;
    groups;
    groupNames;
    selectedGroup;
    constructor(contributorService, locationService) {
        this.contributorService = contributorService;
        this.locationService = locationService;
    }
    ngOnInit() {
        const groupName = this.locationService.search().group || '';
        // no need to unsubscribe because `contributors` completes
        this.contributorService.contributors
            .subscribe(grps => {
            this.groups = grps;
            this.groupNames = grps.map(g => g.name);
            this.selectGroup(groupName);
        });
    }
    selectGroup(name) {
        name = name.toLowerCase();
        this.selectedGroup = this.groups.find(g => g.name.toLowerCase() === name) || this.groups[0];
        this.locationService.setSearch('', { group: this.selectedGroup.name });
    }
};
ContributorListComponent = __decorate([
    Component({
        selector: 'aio-contributor-list',
        template: `
  <div class="flex-center group-buttons">
  <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events -->
    <a *ngFor="let name of groupNames"
       [class.selected]="name == selectedGroup.name"
       class="button mat-button filter-button"
       (click)="selectGroup(name)">{{name}}</a>
  </div>
  <section *ngIf="selectedGroup" class="grid-fluid">
    <div class="contributor-group">
      <aio-contributor *ngFor="let person of selectedGroup.contributors" [person]="person"></aio-contributor>
    </div>
  </section>`
    }),
    __metadata("design:paramtypes", [ContributorService,
        LocationService])
], ContributorListComponent);
export { ContributorListComponent };
