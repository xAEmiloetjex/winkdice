import { AfterViewInit, ElementRef, OnInit, QueryList } from '@angular/core';
import { CodeComponent } from './code.component';
export interface TabInfo {
    class: string | null;
    code: string;
    language: string | null;
    linenums: any;
    path: string;
    region: string;
    header: string | null;
}
/**
 * Renders a set of tab group of code snippets.
 *
 * The innerHTML of the `<code-tabs>` component should contain `<code-pane>` elements.
 * Each `<code-pane>` has the same interface as the embedded `<code-example>` component.
 * The optional `linenums` attribute is the default `linenums` for each code pane.
 */
export declare class CodeTabsComponent implements OnInit, AfterViewInit {
    tabs: TabInfo[];
    linenums: string;
    content: ElementRef<HTMLDivElement>;
    codeComponents: QueryList<CodeComponent>;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /** Gets the extracted TabInfo data from the provided code-pane element. */
    private getTabInfo;
}
