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
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Logger } from 'app/shared/logger.service';
import { PrettyPrinter } from './pretty-printer.service';
import { CopierService } from 'app/shared/copier.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { StackblitzService } from 'app/shared/stackblitz.service';
// @ts-expect-error
import version from '../../../../tools/stackblitz/rxjs.version';
/**
 * If linenums is not set, this is the default maximum number of lines that
 * an example can display without line numbers.
 */
const DEFAULT_LINE_NUMS_COUNT = 10;
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
let CodeComponent = class CodeComponent {
    snackbar;
    pretty;
    copier;
    logger;
    stackblitz;
    ariaLabelCopy = '';
    ariaLabelEdit = '';
    /** The code to be copied when clicking the copy button, this should not be HTML encoded */
    codeText;
    /** Code that should be formatted with current inputs and displayed in the view. */
    set code(code) {
        this._code = code;
        if (!this._code || !this._code.trim()) {
            this.showMissingCodeMessage();
        }
        else {
            this.formatDisplayedCode();
        }
    }
    get code() {
        return this._code;
    }
    _code;
    /** Whether the copy button should be shown. */
    hideCopy;
    /** Language to render the code (e.g. javascript, dart, typescript). */
    language;
    /**
     * Whether to display line numbers:
     *  - If false: hide
     *  - If true: show
     *  - If number: show but start at that number
     */
    linenums;
    /** Path to the source of the code. */
    path;
    /** Region of the source of the code being displayed. */
    region;
    /** Optional header to be displayed above the code. */
    set header(header) {
        this._header = header;
        this.ariaLabelCopy = this.header ? `Copy code snippet from ${this.header}` : '';
        this.ariaLabelEdit = this.header ? `Edit code snippet from ${this.header} in StackBlitz` : '';
    }
    get header() {
        return this._header;
    }
    _header;
    codeFormatted = new EventEmitter();
    /** The element in the template that will display the formatted code. */
    codeContainer;
    constructor(snackbar, pretty, copier, logger, stackblitz) {
        this.snackbar = snackbar;
        this.pretty = pretty;
        this.copier = copier;
        this.logger = logger;
        this.stackblitz = stackblitz;
    }
    ngOnChanges() {
        // If some inputs have changed and there is code displayed, update the view with the latest
        // formatted code.
        if (this.code) {
            this.formatDisplayedCode();
        }
    }
    formatDisplayedCode() {
        const leftAlignedCode = leftAlign(this.code);
        this.setCodeHtml(leftAlignedCode); // start with unformatted code
        this.codeText = this.getCodeText(); // store the unformatted code as text (for copying)
        this.pretty
            .formatCode(leftAlignedCode, this.language ?? '', this.getLinenums(leftAlignedCode))
            .pipe(tap(() => this.codeFormatted.emit()))
            .subscribe((c) => this.setCodeHtml(c), () => {
            /* ignore failure to format */
        });
    }
    /** Sets the message showing that the code could not be found. */
    showMissingCodeMessage() {
        const src = this.path ? this.path + (this.region ? '#' + this.region : '') : '';
        const srcMsg = src ? ` for\n${src}` : '.';
        this.setCodeHtml(`<p class="code-missing">The code sample is missing${srcMsg}</p>`);
    }
    /** Sets the innerHTML of the code container to the provided code string. */
    setCodeHtml(formattedCode) {
        // **Security:** Code example content is provided by docs authors and as such its considered to
        // be safe for innerHTML purposes.
        this.codeContainer.nativeElement.innerHTML = formattedCode;
    }
    /** Gets the textContent of the displayed code element. */
    getCodeText() {
        // `prettify` may remove newlines, e.g. when `linenums` are on. Retrieve the content of the
        // container as text, before prettifying it.
        // We take the textContent because we don't want it to be HTML encoded.
        return this.codeContainer.nativeElement.textContent;
    }
    /** Extracts html placed in the `// html: ` comment in the code.  */
    getHtmlFromCode(code) {
        const pattern = new RegExp('// html: (.*)');
        const matches = code.match(pattern);
        return matches ? matches[1] : '';
    }
    /** Copies the code snippet to the user's clipboard. */
    doCopy() {
        const code = this.codeText;
        const successfullyCopied = this.copier.copyText(code);
        if (successfullyCopied) {
            this.logger.log('Copied code to clipboard:', code);
            this.snackbar.open('Code Copied', '', { duration: 800 });
        }
        else {
            this.logger.error(new Error(`ERROR copying code to clipboard: "${code}"`));
            this.snackbar.open('Copy failed. Please try again!', '', { duration: 800 });
        }
    }
    editInStackBlitz() {
        this.stackblitz.openProject({
            code: this.codeText,
            language: this.language ?? '',
            dependencies: {
                rxjs: version,
            },
            html: this.getHtmlFromCode(this.codeText),
        });
    }
    /** Gets the calculated value of linenums (boolean/number). */
    getLinenums(code) {
        const linenums = typeof this.linenums === 'boolean'
            ? this.linenums
            : this.linenums === 'true'
                ? true
                : this.linenums === 'false'
                    ? false
                    : typeof this.linenums === 'string'
                        ? parseInt(this.linenums, 10)
                        : this.linenums;
        // if no linenums, enable line numbers if more than one line
        return linenums == null || isNaN(linenums) ? (code.match(/\n/g) || []).length > DEFAULT_LINE_NUMS_COUNT : linenums;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CodeComponent.prototype, "hideCopy", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CodeComponent.prototype, "language", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CodeComponent.prototype, "linenums", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CodeComponent.prototype, "path", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CodeComponent.prototype, "region", void 0);
__decorate([
    Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], CodeComponent.prototype, "header", null);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CodeComponent.prototype, "codeFormatted", void 0);
__decorate([
    ViewChild('codeContainer', { static: true }),
    __metadata("design:type", typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object)
], CodeComponent.prototype, "codeContainer", void 0);
CodeComponent = __decorate([
    Component({
        selector: 'aio-code',
        template: `
    <pre class="prettyprint lang-{{ language }}">
      <button *ngIf="!hideCopy" class="material-icons copy-button no-print"
        title="Copy code snippet"
        [attr.aria-label]="ariaLabelCopy"
        (click)="doCopy()">
        <span aria-hidden="true">content_copy</span>
      </button>
      <button *ngIf="!hideCopy" class="material-icons edit-button no-print"
        title="Edit in StackBlitz"
        [attr.aria-label]="ariaLabelEdit"
        (click)="editInStackBlitz()">
        <span aria-hidden="true">open_in_new</span>
      </button>
      <code class="animated fadeIn" #codeContainer></code>
    </pre>
  `,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof MatSnackBar !== "undefined" && MatSnackBar) === "function" ? _a : Object, PrettyPrinter,
        CopierService,
        Logger,
        StackblitzService])
], CodeComponent);
export { CodeComponent };
function leftAlign(text) {
    let indent = Number.MAX_VALUE;
    const lines = text.split('\n');
    lines.forEach((line) => {
        const lineIndent = line.search(/\S/);
        if (lineIndent !== -1) {
            indent = Math.min(lineIndent, indent);
        }
    });
    return lines
        .map((line) => line.substr(indent))
        .join('\n')
        .trim();
}
