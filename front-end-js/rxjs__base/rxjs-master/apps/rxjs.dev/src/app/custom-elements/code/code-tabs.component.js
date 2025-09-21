var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
/* tslint:disable component-selector */
import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CodeComponent } from './code.component';
/**
 * Renders a set of tab group of code snippets.
 *
 * The innerHTML of the `<code-tabs>` component should contain `<code-pane>` elements.
 * Each `<code-pane>` has the same interface as the embedded `<code-example>` component.
 * The optional `linenums` attribute is the default `linenums` for each code pane.
 */
let CodeTabsComponent = class CodeTabsComponent {
    tabs;
    linenums;
    content;
    codeComponents;
    ngOnInit() {
        this.tabs = [];
        const codeExamples = Array.from(this.content.nativeElement.querySelectorAll('code-pane'));
        for (const tabContent of codeExamples) {
            this.tabs.push(this.getTabInfo(tabContent));
        }
    }
    ngAfterViewInit() {
        this.codeComponents.toArray().forEach((codeComponent, i) => {
            codeComponent.code = this.tabs[i].code;
        });
    }
    /** Gets the extracted TabInfo data from the provided code-pane element. */
    getTabInfo(tabContent) {
        return {
            class: tabContent.getAttribute('class'),
            code: tabContent.innerHTML,
            language: tabContent.getAttribute('language'),
            linenums: tabContent.getAttribute('linenums') || this.linenums,
            path: tabContent.getAttribute('path') || '',
            region: tabContent.getAttribute('region') || '',
            header: tabContent.getAttribute('header'),
        };
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], CodeTabsComponent.prototype, "linenums", void 0);
__decorate([
    ViewChild('content', { static: true }),
    __metadata("design:type", typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object)
], CodeTabsComponent.prototype, "content", void 0);
__decorate([
    ViewChildren(CodeComponent),
    __metadata("design:type", typeof (_b = typeof QueryList !== "undefined" && QueryList) === "function" ? _b : Object)
], CodeTabsComponent.prototype, "codeComponents", void 0);
CodeTabsComponent = __decorate([
    Component({
        // eslint-disable-next-line @angular-eslint/component-selector
        selector: 'code-tabs',
        template: `
    <!-- Use content projection so that the provided HTML's code-panes can be split into tabs -->
    <div #content style="display: none"><ng-content></ng-content></div>
    <mat-card>
      <mat-tab-group class="code-tab-group" disableRipple>
        <mat-tab style="overflow-y: hidden;" *ngFor="let tab of tabs">
          <ng-template mat-tab-label>
            <span class="{{ tab.class }}">{{ tab.header }}</span>
          </ng-template>
          <aio-code
            class="{{ tab.class }}"
            [language]="tab.language"
            [linenums]="tab.linenums"
            [path]="tab.path"
            [region]="tab.region"
            [header]="tab.header"
          >
          </aio-code>
        </mat-tab>
      </mat-tab-group>
    </mat-card>
  `,
    })
], CodeTabsComponent);
export { CodeTabsComponent };
