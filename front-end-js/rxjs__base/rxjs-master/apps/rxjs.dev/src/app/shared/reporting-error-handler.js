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
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { WindowToken } from './window';
/**
 * Extend the default error handling to report errors to an external service - e.g Google Analytics.
 *
 * Errors outside the Angular application may also be handled by `window.onerror`.
 */
let ReportingErrorHandler = class ReportingErrorHandler extends ErrorHandler {
    window;
    constructor(window) {
        super();
        this.window = window;
    }
    /**
     * Send error info to Google Analytics, in addition to the default handling.
     *
     * @param error Information about the error.
     */
    handleError(error) {
        try {
            super.handleError(error);
        }
        catch (e) {
            this.reportError(e);
        }
        this.reportError(error);
    }
    reportError(error) {
        if (this.window.onerror) {
            if (error instanceof Error) {
                this.window.onerror(error.message, undefined, undefined, undefined, error);
            }
            else {
                if (typeof error === 'object') {
                    try {
                        error = JSON.stringify(error);
                    }
                    catch {
                        // Ignore the error and just let it be stringified.
                    }
                }
                this.window.onerror(`${error}`);
            }
        }
    }
};
ReportingErrorHandler = __decorate([
    Injectable(),
    __param(0, Inject(WindowToken)),
    __metadata("design:paramtypes", [Window])
], ReportingErrorHandler);
export { ReportingErrorHandler };
