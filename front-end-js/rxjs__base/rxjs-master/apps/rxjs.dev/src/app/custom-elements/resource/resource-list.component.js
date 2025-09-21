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
import { Component, HostListener } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { ResourceService } from './resource.service';
let ResourceListComponent = class ResourceListComponent {
    resourceService;
    categories;
    location;
    scrollPos = 0;
    constructor(location, resourceService) {
        this.resourceService = resourceService;
        this.location = location.pathname.replace(/^\/+/, '');
    }
    href(cat) {
        return this.location + '#' + cat.id;
    }
    ngOnInit() {
        // Not using async pipe because cats appear twice in template
        // No need to unsubscribe because categories observable completes.
        this.resourceService.categories.subscribe((cats) => (this.categories = cats));
    }
    onScroll(target) {
        this.scrollPos = target ? target.scrollTop || target.body.scrollTop || 0 : 0;
    }
};
__decorate([
    HostListener('window:scroll', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResourceListComponent.prototype, "onScroll", null);
ResourceListComponent = __decorate([
    Component({
        selector: 'aio-resource-list',
        template: `
    <div class="resources-container">
      <div class="l-flex--column">
        <div class="showcase" *ngFor="let category of categories">
          <header class="c-resource-header">
            <!-- eslint-disable-next-line @angular-eslint/template/accessibility-elements-content -->
            <a class="h-anchor-offset" id="{{ category.id }}"></a>
            <h2>{{ category.title }}</h2>
          </header>

          <div class="shadow-1">
            <div *ngFor="let subCategory of category.subCategories">
            <!-- eslint-disable-next-line @angular-eslint/template/accessibility-elements-content -->
              <a class="h-anchor-offset" id="{{ subCategory.id }}"></a>
              <h3 class="subcategory-title">{{ subCategory.title }}</h3>

              <div *ngFor="let resource of subCategory.resources">
                <div class="c-resource" *ngIf="resource.rev">
                  <a class="l-flex--column resource-row-link" target="_blank" [href]="resource.url">
                    <div>
                      <h4>{{ resource.title }}</h4>
                      <p class="resource-description">{{ resource.desc || 'No Description' }}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof PlatformLocation !== "undefined" && PlatformLocation) === "function" ? _a : Object, ResourceService])
], ResourceListComponent);
export { ResourceListComponent };
