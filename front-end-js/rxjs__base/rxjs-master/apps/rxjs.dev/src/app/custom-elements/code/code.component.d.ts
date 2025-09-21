import { ElementRef, OnChanges } from '@angular/core';
import { Logger } from 'app/shared/logger.service';
import { PrettyPrinter } from './pretty-printer.service';
import { CopierService } from 'app/shared/copier.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StackblitzService } from 'app/shared/stackblitz.service';
/**
 * Formatted Code Block
 *
 * Pretty renders a code block, used in the docs and API reference by the code-example and
 * code-tabs embedded components.
 * It includes a "copy" button that will send the content to the clipboard when clicked
 *
 * Example usage:
 *
 * ```
 * <aio-code
 *   [language]="ts"
 *   [linenums]="true"
 *   [path]="router/src/app/app.module.ts"
 *   [region]="animations-module">
 * </aio-code>
 * ```
 *
 *
 * Renders code provided through the `updateCode` method.
 */
export declare class CodeComponent implements OnChanges {
    private snackbar;
    private pretty;
    private copier;
    private logger;
    private stackblitz;
    ariaLabelCopy: string;
    ariaLabelEdit: string;
    /** The code to be copied when clicking the copy button, this should not be HTML encoded */
    private codeText;
    /** Code that should be formatted with current inputs and displayed in the view. */
    set code(code: string);
    get code(): string;
    _code: string;
    /** Whether the copy button should be shown. */
    hideCopy: boolean;
    /** Language to render the code (e.g. javascript, dart, typescript). */
    language: string | null;
    /**
     * Whether to display line numbers:
     *  - If false: hide
     *  - If true: show
     *  - If number: show but start at that number
     */
    linenums: boolean | number | string;
    /** Path to the source of the code. */
    path: string;
    /** Region of the source of the code being displayed. */
    region: string;
    /** Optional header to be displayed above the code. */
    set header(header: string | null);
    get header(): string | null;
    private _header;
    codeFormatted: any;
    /** The element in the template that will display the formatted code. */
    codeContainer: ElementRef;
    constructor(snackbar: MatSnackBar, pretty: PrettyPrinter, copier: CopierService, logger: Logger, stackblitz: StackblitzService);
    ngOnChanges(): void;
    private formatDisplayedCode;
    /** Sets the message showing that the code could not be found. */
    private showMissingCodeMessage;
    /** Sets the innerHTML of the code container to the provided code string. */
    private setCodeHtml;
    /** Gets the textContent of the displayed code element. */
    private getCodeText;
    /** Extracts html placed in the `// html: ` comment in the code.  */
    private getHtmlFromCode;
    /** Copies the code snippet to the user's clipboard. */
    doCopy(): void;
    editInStackBlitz(): void;
    /** Gets the calculated value of linenums (boolean/number). */
    getLinenums(code: string): number | boolean;
}
