import { ErrorHandler } from '@angular/core';
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
export declare const SVG_ICONS: any;
export interface SvgIconInfo {
    name: string;
    svgSource: string;
}
/**
 * A custom replacement for Angular Material's `MdIconRegistry`, which allows
 * us to provide preloaded icon SVG sources.
 */
export declare class CustomIconRegistry extends MatIconRegistry {
    private preloadedSvgElements;
    constructor(http: HttpClient, sanitizer: DomSanitizer, document: Document, svgIcons: SvgIconInfo[], errorHandler: ErrorHandler);
    getNamedSvgIcon(iconName: string, namespace?: string): any;
    private loadSvgElements;
}
