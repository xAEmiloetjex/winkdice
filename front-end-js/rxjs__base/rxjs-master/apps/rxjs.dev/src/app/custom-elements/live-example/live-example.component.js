var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
/* tslint:disable component-selector */
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
import { boolFromValue, getAttrs, getAttrValue } from 'app/shared/attribute-utils';
const LIVE_EXAMPLE_BASE = CONTENT_URL_PREFIX + 'live-examples/';
const ZIP_BASE = CONTENT_URL_PREFIX + 'zips/';
/**
 * Angular.io Live Example Embedded Component
 *
 * Renders a link to a live/host example of the doc page.
 *
 * All attributes and the text content are optional
 *
 * Usage:
 *   <live-example
 *      [name="..."]        // name of the example directory
 *      [stackblitz="...""] // name of the stackblitz file (becomes part of zip file name as well)
 *      [embedded]          // embed the stackblitz in the doc page, else display in new browser tab (default)
 *      [noDownload]        // no downloadable zip option
 *      [downloadOnly]      // just the zip
 *      [title="..."]>      // text for live example link and tooltip
 *        text              // higher precedence way to specify text for live example link and tooltip
 *  </live-example>
 * Example:
 *   <p>Run <live-example>Try the live example</live-example></p>.
 *   // ~/resources/live-examples/{page}/stackblitz.json
 *
 *   <p>Run <live-example name="toh-pt1">this example</live-example></p>.
 *   // ~/resources/live-examples/toh-pt1/stackblitz.json
 *
 *   // Link to the default stackblitz in the toh-pt1 sample
 *   // The title overrides default ("live example") with "Tour of Heroes - Part 1"
 *   <p>Run <live-example name="toh-pt1" title="Tour of Heroes - Part 1"></live-example></p>.
 *   // ~/resources/live-examples/toh-pt1/stackblitz.json
 *
 *   <p>Run <live-example stackblitz="minimal"></live-example></p>.
 *   // ~/resources/live-examples/{page}/minimal.stackblitz.json
 *
 *   // Embed the current page's default stackblitz
 *   // Text within tag is "live example"
 *   // No title (no tooltip)
 *   <live-example embedded title=""></live-example>
 *   // ~/resources/live-examples/{page}/stackblitz.json
 *
 *   // Displays within the document page as an embedded style stackblitz editor
 *   <live-example name="toh-pt1" embedded stackblitz="minimal">Tour of Heroes - Part 1</live-example>
 *   // ~/resources/live-examples/toh-pt1/minimal.stackblitz.json
 */
let LiveExampleComponent = class LiveExampleComponent {
    mode;
    enableDownload;
    stackblitz;
    zip;
    title;
    content;
    constructor(elementRef, location) {
        const attrs = getAttrs(elementRef);
        const exampleDir = this.getExampleDir(attrs, location.path(false));
        const stackblitzName = this.getStackblitzName(attrs);
        this.mode = this.getMode(attrs);
        this.enableDownload = this.getEnableDownload(attrs);
        this.stackblitz = this.getStackblitz(exampleDir, stackblitzName, this.mode === 'embedded');
        this.zip = this.getZip(exampleDir, stackblitzName);
        this.title = this.getTitle(attrs);
    }
    ngAfterContentInit() {
        // Angular will sanitize this title when displayed, so it should be plain text.
        const textContent = this.content.nativeElement.textContent.trim();
        if (textContent) {
            this.title = textContent;
        }
    }
    getEnableDownload(attrs) {
        const downloadDisabled = boolFromValue(getAttrValue(attrs, 'noDownload'));
        return !downloadDisabled;
    }
    getExampleDir(attrs, path) {
        let exampleDir = getAttrValue(attrs, 'name');
        if (!exampleDir) {
            // Take the last path segment, excluding query params and hash fragment.
            const match = path.match(/[^/?#]+(?=\/?(?:\?|#|$))/);
            exampleDir = match ? match[0] : 'index';
        }
        return exampleDir.trim();
    }
    getMode(attrs) {
        const downloadOnly = boolFromValue(getAttrValue(attrs, 'downloadOnly'));
        const isEmbedded = boolFromValue(getAttrValue(attrs, 'embedded'));
        return downloadOnly ? 'downloadOnly' : isEmbedded ? 'embedded' : 'default';
    }
    getStackblitz(exampleDir, stackblitzName, isEmbedded) {
        const urlQuery = isEmbedded ? '?ctl=1' : '';
        return `${LIVE_EXAMPLE_BASE}${exampleDir}/${stackblitzName}stackblitz.html${urlQuery}`;
    }
    getStackblitzName(attrs) {
        const attrValue = (getAttrValue(attrs, 'stackblitz') || '').trim();
        return attrValue && `${attrValue}.`;
    }
    getTitle(attrs) {
        return (getAttrValue(attrs, 'title') || 'live example').trim();
    }
    getZip(exampleDir, stackblitzName) {
        const zipName = exampleDir.split('/')[0];
        return `${ZIP_BASE}${exampleDir}/${stackblitzName}${zipName}.zip`;
    }
};
__decorate([
    ViewChild('content', { static: true }),
    __metadata("design:type", typeof (_c = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _c : Object)
], LiveExampleComponent.prototype, "content", void 0);
LiveExampleComponent = __decorate([
    Component({
        // eslint-disable-next-line @angular-eslint/component-selector
        selector: 'live-example',
        template: `
    <!-- Content projection is used to get the content HTML provided to the component. -->
    <span #content style="display: none"><ng-content></ng-content></span>

    <span [ngSwitch]="mode">
      <span *ngSwitchCase="'embedded'">
        <div title="{{ title }}">
          <aio-embedded-stackblitz [src]="stackblitz"></aio-embedded-stackblitz>
        </div>
        <p *ngIf="enableDownload">You can also <a [href]="zip" download title="Download example">download this example</a>.</p>
      </span>
      <span *ngSwitchCase="'downloadOnly'">
        <a [href]="zip" download title="{{ title }}">{{ title }}</a>
      </span>
      <span *ngSwitchDefault>
        <a [href]="stackblitz" target="_blank" title="{{ title }}">{{ title }}</a>
        <span *ngIf="enableDownload"> / <a [href]="zip" download title="Download example">download example</a> </span>
      </span>
    </span>
  `,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, typeof (_b = typeof Location !== "undefined" && Location) === "function" ? _b : Object])
], LiveExampleComponent);
export { LiveExampleComponent };
///// EmbeddedStackblitzComponent ///
/**
 * Hides the <iframe> so we can test LiveExampleComponent without actually triggering
 * a call to stackblitz to load the iframe
 */
let EmbeddedStackblitzComponent = class EmbeddedStackblitzComponent {
    src;
    iframe;
    ngAfterViewInit() {
        // DEVELOPMENT TESTING ONLY
        // this.src = 'https://angular.io/resources/live-examples/quickstart/ts/stackblitz.json';
        if (this.iframe) {
            // security: the `src` is always authored by the documentation team
            // and is considered to be safe
            this.iframe.nativeElement.src = this.src;
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], EmbeddedStackblitzComponent.prototype, "src", void 0);
__decorate([
    ViewChild('iframe', { static: true }),
    __metadata("design:type", typeof (_d = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _d : Object)
], EmbeddedStackblitzComponent.prototype, "iframe", void 0);
EmbeddedStackblitzComponent = __decorate([
    Component({
        selector: 'aio-embedded-stackblitz',
        template: '<iframe #iframe frameborder="0" width="100%" height="100%"></iframe>',
        styles: ['iframe { min-height: 400px; }'],
    })
], EmbeddedStackblitzComponent);
export { EmbeddedStackblitzComponent };
