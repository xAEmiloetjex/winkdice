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
/* tslint:disable component-selector */
import { Component, HostBinding, ElementRef, ViewChild, Input } from '@angular/core';
import { CodeComponent } from './code.component';
/**
 * An embeddable code block that displays nicely formatted code.
 * Example usage:
 *
 * ```
 * <code-example language="ts" linenums="2" class="special" header="Do Stuff">
 * // a code block
 * console.log('do stuff');
 * </code-example>
 * ```
 */
let CodeExampleComponent = class CodeExampleComponent {
    classes;
    language;
    linenums;
    region;
    set header(header) {
        this._header = header;
        this.classes = {
            'headed-code': !!this.header,
            'simple-code': !this.header,
        };
    }
    get header() { return this._header; }
    _header;
    set path(path) {
        this._path = path;
        this.isAvoid = this.path.indexOf('.avoid.') !== -1;
    }
    get path() { return this._path; }
    _path = '';
    set hidecopy(hidecopy) {
        // Coerce the boolean value.
        this._hidecopy = hidecopy != null && `${hidecopy}` !== 'false';
    }
    get hidecopy() { return this._hidecopy; }
    _hidecopy;
    // eslint-disable-next-line @angular-eslint/no-input-rename
    set hyphenatedHideCopy(hidecopy) {
        this.hidecopy = hidecopy;
    }
    // eslint-disable-next-line @angular-eslint/no-input-rename
    set capitalizedHideCopy(hidecopy) {
        this.hidecopy = hidecopy;
    }
    isAvoid = false;
    content;
    aioCode;
    ngAfterViewInit() {
        this.aioCode.code = this.content.nativeElement.innerHTML;
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], CodeExampleComponent.prototype, "language", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CodeExampleComponent.prototype, "linenums", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CodeExampleComponent.prototype, "region", void 0);
__decorate([
    Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], CodeExampleComponent.prototype, "header", null);
__decorate([
    Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], CodeExampleComponent.prototype, "path", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], CodeExampleComponent.prototype, "hidecopy", null);
__decorate([
    Input('hide-copy'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], CodeExampleComponent.prototype, "hyphenatedHideCopy", null);
__decorate([
    Input('hideCopy'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], CodeExampleComponent.prototype, "capitalizedHideCopy", null);
__decorate([
    HostBinding('class.avoidFile'),
    __metadata("design:type", Object)
], CodeExampleComponent.prototype, "isAvoid", void 0);
__decorate([
    ViewChild('content', { static: true }),
    __metadata("design:type", typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object)
], CodeExampleComponent.prototype, "content", void 0);
__decorate([
    ViewChild(CodeComponent, { static: true }),
    __metadata("design:type", CodeComponent)
], CodeExampleComponent.prototype, "aioCode", void 0);
CodeExampleComponent = __decorate([
    Component({
        // eslint-disable-next-line @angular-eslint/component-selector
        selector: 'code-example',
        template: `
    <!-- Content projection is used to get the content HTML provided to this component -->
    <div #content style="display: none"><ng-content></ng-content></div>
    <header *ngIf="header">{{header}}</header>
    <aio-code [ngClass]="classes"
              [language]="language"
              [linenums]="linenums"
              [path]="path"
              [region]="region"
              [hideCopy]="hidecopy"
              [header]="header">
    </aio-code>
  `,
    })
], CodeExampleComponent);
export { CodeExampleComponent };
