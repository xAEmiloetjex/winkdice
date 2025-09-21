import { ElementRef, AfterViewInit } from '@angular/core';
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
export declare class CodeExampleComponent implements AfterViewInit {
    classes: Record<string, boolean>;
    language: string;
    linenums: string;
    region: string;
    set header(header: string);
    get header(): string;
    private _header;
    set path(path: string);
    get path(): string;
    private _path;
    set hidecopy(hidecopy: boolean);
    get hidecopy(): boolean;
    private _hidecopy;
    set hyphenatedHideCopy(hidecopy: boolean);
    set capitalizedHideCopy(hidecopy: boolean);
    isAvoid: boolean;
    content: ElementRef;
    aioCode: CodeComponent;
    ngAfterViewInit(): void;
}
