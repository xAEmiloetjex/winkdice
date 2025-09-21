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
let NavItemComponent = class NavItemComponent {
    isWide = false;
    level = 1;
    node;
    isParentExpanded = true;
    selectedNodes;
    isExpanded = false;
    isSelected = false;
    classes;
    nodeChildren;
    ngOnChanges() {
        this.nodeChildren = this.node && this.node.children ? this.node.children.filter((n) => !n.hidden) : [];
        if (this.selectedNodes) {
            const ix = this.selectedNodes.indexOf(this.node);
            this.isSelected = ix !== -1; // this node is the selected node or its ancestor
            this.isExpanded =
                this.isParentExpanded &&
                    (this.isSelected || // expand if selected or ...
                        // preserve expanded state when display is wide; collapse in mobile.
                        (this.isWide && this.isExpanded));
        }
        else {
            this.isSelected = false;
        }
        this.setClasses();
    }
    setClasses() {
        this.classes = {
            ['level-' + this.level]: true,
            collapsed: !this.isExpanded,
            expanded: this.isExpanded,
            selected: this.isSelected,
        };
    }
    headerClicked() {
        this.isExpanded = !this.isExpanded;
        this.setClasses();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], NavItemComponent.prototype, "isWide", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NavItemComponent.prototype, "level", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NavItemComponent.prototype, "node", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NavItemComponent.prototype, "isParentExpanded", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], NavItemComponent.prototype, "selectedNodes", void 0);
NavItemComponent = __decorate([
    Component({
        selector: 'aio-nav-item',
        template: `<div *ngIf="!node.children">
      <a href="{{ node.url }}" [ngClass]="classes" title="{{ node.tooltip }}" class="vertical-menu-item">
        {{ node.title }}
      </a>
    </div>

    <div *ngIf="node.children">
      <a
        *ngIf="node.url != null"
        href="{{ node.url }}"
        [ngClass]="classes"
        title="{{ node.tooltip }}"
        (click)="headerClicked()"
        class="vertical-menu-item heading"
      >
        {{ node.title }}
        <mat-icon class="rotating-icon" svgIcon="keyboard_arrow_right"></mat-icon>
      </a>

      <button
        *ngIf="node.url == null"
        type="button"
        [ngClass]="classes"
        title="{{ node.tooltip }}"
        (click)="headerClicked()"
        class="vertical-menu-item heading"
        [attr.aria-pressed]="isExpanded"
      >
        {{ node.title }}
        <mat-icon class="rotating-icon" svgIcon="keyboard_arrow_right"></mat-icon>
      </button>

      <div class="heading-children" [ngClass]="classes">
        <aio-nav-item
          *ngFor="let node of nodeChildren"
          [level]="level + 1"
          [isWide]="isWide"
          [isParentExpanded]="isExpanded"
          [node]="node"
          [selectedNodes]="selectedNodes"
        ></aio-nav-item>
      </div>
    </div>`,
    })
], NavItemComponent);
export { NavItemComponent };
