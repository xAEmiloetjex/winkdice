var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
let ModeBannerComponent = class ModeBannerComponent {
    mode;
    version;
};
__decorate([
    Input(),
    __metadata("design:type", String)
], ModeBannerComponent.prototype, "mode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModeBannerComponent.prototype, "version", void 0);
ModeBannerComponent = __decorate([
    Component({
        selector: 'aio-mode-banner',
        template: `
  <div *ngIf="mode == 'archive'" class="mode-banner">
    This is the <strong>archived documentation for Angular v{{version?.major}}.</strong>
    Please visit <a href="https://angular.io/">angular.io</a> to see documentation for the current version of Angular.
  </div>
  `
    })
], ModeBannerComponent);
export { ModeBannerComponent };
