var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
import { InjectionToken, Inject, Injectable, Optional, ErrorHandler } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { of } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Use SVG_ICONS (and SvgIconInfo) as "multi" providers to provide the SVG source
 * code for the icons that you wish to have preloaded in the `CustomIconRegistry`
 * For compatibility with the MdIconComponent, please ensure that the SVG source has
 * the following attributes:
 *
 * * `xmlns="http://www.w3.org/2000/svg"`
 * * `focusable="false"` (disable IE11 default behavior to make SVGs focusable)
 * * `height="100%"` (the default)
 * * `width="100%"` (the default)
 * * `preserveAspectRatio="xMidYMid meet"` (the default)
 *
 */
export const SVG_ICONS = new InjectionToken('SvgIcons');
/**
 * A custom replacement for Angular Material's `MdIconRegistry`, which allows
 * us to provide preloaded icon SVG sources.
 */
let CustomIconRegistry = class CustomIconRegistry extends MatIconRegistry {
    preloadedSvgElements = {};
    constructor(http, sanitizer, document, svgIcons, errorHandler) {
        super(http, sanitizer, document, errorHandler);
        this.loadSvgElements(svgIcons);
    }
    getNamedSvgIcon(iconName, namespace) {
        if (this.preloadedSvgElements[iconName]) {
            return of(this.preloadedSvgElements[iconName].cloneNode(true));
        }
        return super.getNamedSvgIcon(iconName, namespace);
    }
    loadSvgElements(svgIcons) {
        const div = document.createElement('DIV');
        svgIcons.forEach(icon => {
            // SECURITY: the source for the SVG icons is provided in code by trusted developers
            div.innerHTML = icon.svgSource;
            this.preloadedSvgElements[icon.name] = div.querySelector('svg');
        });
    }
};
CustomIconRegistry = __decorate([
    Injectable(),
    __param(2, Optional()),
    __param(2, Inject(DOCUMENT)),
    __param(3, Inject(SVG_ICONS)),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object, typeof (_b = typeof DomSanitizer !== "undefined" && DomSanitizer) === "function" ? _b : Object, Document, Array, typeof (_c = typeof ErrorHandler !== "undefined" && ErrorHandler) === "function" ? _c : Object])
], CustomIconRegistry);
export { CustomIconRegistry };
