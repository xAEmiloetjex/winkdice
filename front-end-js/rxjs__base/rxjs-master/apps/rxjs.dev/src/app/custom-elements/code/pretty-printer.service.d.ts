import { Logger } from 'app/shared/logger.service';
/**
 * Wrapper around the prettify.js library
 */
export declare class PrettyPrinter {
    private logger;
    private prettyPrintOne;
    constructor(logger: Logger);
    private getPrettyPrintOne;
    /**
     * Format code snippet as HTML
     *
     * @param code the code snippet to format; should already be HTML encoded
     * @param language The language of the code to render (could be javascript, html, typescript, etc)
     * @param linenums Whether to display line numbers:
     *  - false: don't display
     *  - true: do display
     *  - number: do display but start at the given number
     * @returns Observable of formatted code
     */
    formatCode(code: string, language?: string, linenums?: number | boolean): any;
}
