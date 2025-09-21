import { ErrorHandler } from '@angular/core';
/**
 * Extend the default error handling to report errors to an external service - e.g Google Analytics.
 *
 * Errors outside the Angular application may also be handled by `window.onerror`.
 */
export declare class ReportingErrorHandler extends ErrorHandler {
    private window;
    constructor(window: Window);
    /**
     * Send error info to Google Analytics, in addition to the default handling.
     *
     * @param error Information about the error.
     */
    handleError(error: string | Error): void;
    private reportError;
}
