var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { from as fromPromise } from 'rxjs';
import { first, map, share } from 'rxjs/operators';
import { Logger } from 'app/shared/logger.service';
/**
 * Wrapper around the prettify.js library
 */
let PrettyPrinter = class PrettyPrinter {
    logger;
    prettyPrintOne;
    constructor(logger) {
        this.logger = logger;
        this.prettyPrintOne = fromPromise(this.getPrettyPrintOne()).pipe(share());
    }
    getPrettyPrintOne() {
        const ppo = window.prettyPrintOne;
        return ppo ? Promise.resolve(ppo) :
            // `prettyPrintOne` is not on `window`, which means `prettify.js` has not been loaded yet.
            // Import it; as a side-effect it will add `prettyPrintOne` on `window`.
            import('assets/js/prettify.js')
                .then(() => window.prettyPrintOne, err => {
                const msg = `Cannot get prettify.js from server: ${err.message}`;
                this.logger.error(new Error(msg));
                // return a pretty print fn that always fails.
                return () => { throw new Error(msg); };
            });
    }
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
    formatCode(code, language, linenums) {
        return this.prettyPrintOne.pipe(map(ppo => {
            try {
                return ppo(code, language, linenums);
            }
            catch (err) {
                const msg = `Could not format code that begins '${code.substr(0, 50)}...'.`;
                console.error(msg, err);
                throw new Error(msg);
            }
        }), first());
    }
};
PrettyPrinter = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Logger])
], PrettyPrinter);
export { PrettyPrinter };
