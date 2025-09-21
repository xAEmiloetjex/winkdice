var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* tslint:disable component-selector */
import { Component, Input } from '@angular/core';
/** Custom element wrapper for the material expansion panel with a title input. */
let ExpandableSectionComponent = class ExpandableSectionComponent {
    title;
};
__decorate([
    Input(),
    __metadata("design:type", String)
], ExpandableSectionComponent.prototype, "title", void 0);
ExpandableSectionComponent = __decorate([
    Component({
        selector: 'aio-expandable-section',
        template: `<mat-expansion-panel style="background: inherit">
    <mat-expansion-panel-header>
      {{ title }}
    </mat-expansion-panel-header>

    <ng-content></ng-content>
  </mat-expansion-panel> `,
    })
], ExpandableSectionComponent);
export { ExpandableSectionComponent };
