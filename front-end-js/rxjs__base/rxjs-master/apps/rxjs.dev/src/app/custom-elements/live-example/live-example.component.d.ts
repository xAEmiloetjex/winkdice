import { AfterContentInit, AfterViewInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
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
export declare class LiveExampleComponent implements AfterContentInit {
    readonly mode: 'default' | 'embedded' | 'downloadOnly';
    readonly enableDownload: boolean;
    readonly stackblitz: string;
    readonly zip: string;
    title: string;
    private content;
    constructor(elementRef: ElementRef, location: Location);
    ngAfterContentInit(): void;
    private getEnableDownload;
    private getExampleDir;
    private getMode;
    private getStackblitz;
    private getStackblitzName;
    private getTitle;
    private getZip;
}
/**
 * Hides the <iframe> so we can test LiveExampleComponent without actually triggering
 * a call to stackblitz to load the iframe
 */
export declare class EmbeddedStackblitzComponent implements AfterViewInit {
    src: string;
    iframe: ElementRef;
    ngAfterViewInit(): void;
}
