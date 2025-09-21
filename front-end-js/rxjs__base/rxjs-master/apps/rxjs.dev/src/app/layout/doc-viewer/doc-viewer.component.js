var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DocViewerComponent_1;
var _a, _b, _c;
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { asapScheduler, Observable, of, timer } from 'rxjs';
import { catchError, observeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FILE_NOT_FOUND_ID, FETCHING_ERROR_ID } from 'app/documents/document.service';
import { Logger } from 'app/shared/logger.service';
import { TocService } from 'app/shared/toc.service';
import { ElementsLoader } from 'app/custom-elements/elements-loader';
// Constants
export const NO_ANIMATIONS = 'no-animations';
// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = document.querySelector('aio-doc-viewer');
const initialDocViewerContent = initialDocViewerElement ? initialDocViewerElement.innerHTML : '';
let DocViewerComponent = class DocViewerComponent {
    static { DocViewerComponent_1 = this; }
    logger;
    titleService;
    metaService;
    tocService;
    elementsLoader;
    // Enable/Disable view transition animations.
    static animationsEnabled = true;
    hostElement;
    void$ = of(undefined);
    onDestroy$ = new EventEmitter();
    docContents$ = new EventEmitter();
    currViewContainer = document.createElement('div');
    nextViewContainer = document.createElement('div');
    set doc(newDoc) {
        // Ignore `undefined` values that could happen if the host component
        // does not initially specify a value for the `doc` input.
        if (newDoc) {
            this.docContents$.emit(newDoc);
        }
    }
    // The new document is ready to be inserted into the viewer.
    // (Embedded components have been loaded and instantiated, if necessary.)
    docReady = new EventEmitter();
    // The previous document has been removed from the viewer.
    // (The leaving animation (if any) has been completed and the node has been removed from the DOM.)
    docRemoved = new EventEmitter();
    // The new document has been inserted into the viewer.
    // (The node has been inserted into the DOM, but the entering animation may still be in progress.)
    docInserted = new EventEmitter();
    // The new document has been fully rendered into the viewer.
    // (The entering animation has been completed.)
    docRendered = new EventEmitter();
    constructor(elementRef, logger, titleService, metaService, tocService, elementsLoader) {
        this.logger = logger;
        this.titleService = titleService;
        this.metaService = metaService;
        this.tocService = tocService;
        this.elementsLoader = elementsLoader;
        this.hostElement = elementRef.nativeElement;
        // Security: the initialDocViewerContent comes from the prerendered DOM and is considered to be secure
        this.hostElement.innerHTML = initialDocViewerContent;
        if (this.hostElement.firstElementChild) {
            this.currViewContainer = this.hostElement.firstElementChild;
        }
        this.docContents$
            .pipe(observeOn(asapScheduler), switchMap((newDoc) => this.render(newDoc)), takeUntil(this.onDestroy$))
            .subscribe();
    }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
    /**
     * Prepare for setting the window title and ToC.
     * Return a function to actually set them.
     */
    prepareTitleAndToc(targetElem, docId) {
        const descriptionEl = targetElem.querySelector('.api-body > p:nth-child(2)');
        const titleEl = targetElem.querySelector('h1');
        const needsToc = !!titleEl && !/no-?toc/i.test(titleEl.className);
        const embeddedToc = targetElem.querySelector('aio-toc.embedded');
        if (needsToc && !embeddedToc) {
            // Add an embedded ToC if it's needed and there isn't one in the content already.
            titleEl.insertAdjacentHTML('afterend', '<aio-toc class="embedded"></aio-toc>');
        }
        else if (!needsToc && embeddedToc) {
            // Remove the embedded Toc if it's there and not needed.
            embeddedToc.remove();
        }
        return () => {
            this.tocService.reset();
            let title = '';
            let description = '';
            // Only create ToC for docs with an `<h1>` heading.
            // If you don't want a ToC, add "no-toc" class to `<h1>`.
            if (titleEl) {
                title = typeof titleEl.innerText === 'string' ? titleEl.innerText : titleEl.textContent;
                if (needsToc) {
                    this.tocService.genToc(targetElem, docId);
                }
            }
            if (descriptionEl) {
                description = descriptionEl.innerHTML;
            }
            const formattedTitle = title ? `RxJS - ${title}` : 'RxJS';
            this.addDocumentMetaTags(formattedTitle, description);
            this.titleService.setTitle(formattedTitle);
        };
    }
    /**
     * Add doc content to host element and build it out with embedded components.
     */
    render(doc) {
        let addTitleAndToc;
        this.setNoIndex(doc.id === FILE_NOT_FOUND_ID || doc.id === FETCHING_ERROR_ID);
        return this.void$.pipe(
        // Security: `doc.contents` is always authored by the documentation team
        //           and is considered to be safe.
        tap(() => (this.nextViewContainer.innerHTML = doc.contents || '')), tap(() => (addTitleAndToc = this.prepareTitleAndToc(this.nextViewContainer, doc.id))), switchMap(() => this.elementsLoader.loadContainedCustomElements(this.nextViewContainer)), tap(() => this.docReady.emit()), switchMap(() => this.swapViews(addTitleAndToc)), tap(() => this.docRendered.emit()), catchError((err) => {
            const errorMessage = err instanceof Error ? err.stack : err;
            this.logger.error(new Error(`[DocViewer] Error preparing document '${doc.id}': ${errorMessage}`));
            this.nextViewContainer.innerHTML = '';
            this.setNoIndex(true);
            return this.void$;
        }));
    }
    /**
     * Tell search engine crawlers whether to index this page
     */
    setNoIndex(val) {
        if (val) {
            this.metaService.addTag({ name: 'robots', content: 'noindex' });
        }
        else {
            this.metaService.removeTag('name="robots"');
        }
    }
    /**
     * Swap the views, removing `currViewContainer` and inserting `nextViewContainer`.
     * (At this point all content should be ready, including having loaded and instantiated embedded
     *  components.)
     *
     * Optionally, run a callback as soon as `nextViewContainer` has been inserted, but before the
     * entering animation has been completed. This is useful for work that needs to be done as soon as
     * the element has been attached to the DOM.
     */
    swapViews(onInsertedCb = () => { }) {
        const raf$ = new Observable((subscriber) => {
            const rafId = requestAnimationFrame(() => {
                subscriber.next();
                subscriber.complete();
            });
            return () => cancelAnimationFrame(rafId);
        });
        // Get the actual transition duration (taking global styles into account).
        // According to the [CSSOM spec](https://drafts.csswg.org/cssom/#serializing-css-values),
        // `time` values should be returned in seconds.
        const getActualDuration = (elem) => {
            const cssValue = getComputedStyle(elem).transitionDuration || '';
            const seconds = Number(cssValue.replace(/s$/, ''));
            return 1000 * seconds;
        };
        const animateProp = (elem, prop, from, to, duration = 200) => {
            const animationsDisabled = !DocViewerComponent_1.animationsEnabled || this.hostElement.classList.contains(NO_ANIMATIONS);
            if (prop === 'length' || prop === 'parentRule') {
                // We cannot animate length or parentRule properties because they are readonly
                return this.void$;
            }
            elem.style.transition = '';
            return animationsDisabled
                ? this.void$.pipe(tap(() => (elem.style[prop] = to)))
                : this.void$.pipe(
                // In order to ensure that the `from` value will be applied immediately (i.e.
                // without transition) and that the `to` value will be affected by the
                // `transition` style, we need to ensure an animation frame has passed between
                // setting each style.
                switchMap(() => raf$), tap(() => (elem.style[prop] = from)), switchMap(() => raf$), tap(() => (elem.style.transition = `all ${duration}ms ease-in-out`)), switchMap(() => raf$), tap(() => (elem.style[prop] = to)), switchMap(() => timer(getActualDuration(elem))), switchMap(() => this.void$));
        };
        const animateLeave = (elem) => animateProp(elem, 'opacity', '1', '0.1');
        const animateEnter = (elem) => animateProp(elem, 'opacity', '0.1', '1');
        let done$ = this.void$;
        if (this.currViewContainer.parentElement) {
            done$ = done$.pipe(
            // Remove the current view from the viewer.
            switchMap(() => animateLeave(this.currViewContainer)), tap(() => this.currViewContainer.parentElement?.removeChild(this.currViewContainer)), tap(() => this.docRemoved.emit()));
        }
        return done$.pipe(
        // Insert the next view into the viewer.
        tap(() => this.hostElement.appendChild(this.nextViewContainer)), tap(() => onInsertedCb()), tap(() => this.docInserted.emit()), switchMap(() => animateEnter(this.nextViewContainer)), 
        // Update the view references and clean up unused nodes.
        tap(() => {
            const prevViewContainer = this.currViewContainer;
            this.currViewContainer = this.nextViewContainer;
            this.nextViewContainer = prevViewContainer;
            this.nextViewContainer.innerHTML = ''; // Empty to release memory.
        }));
    }
    addDocumentMetaTags(title, description) {
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary' });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:type', content: 'article' });
        if (description) {
            const formattedDescription = description.replace(/<\/?\w*>/gm, '');
            this.metaService.updateTag({ name: 'twitter:description', content: formattedDescription });
            this.metaService.updateTag({ property: 'og:description', content: formattedDescription });
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DocViewerComponent.prototype, "doc", null);
__decorate([
    Output(),
    __metadata("design:type", Object)
], DocViewerComponent.prototype, "docReady", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], DocViewerComponent.prototype, "docRemoved", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], DocViewerComponent.prototype, "docInserted", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], DocViewerComponent.prototype, "docRendered", void 0);
DocViewerComponent = DocViewerComponent_1 = __decorate([
    Component({
        selector: 'aio-doc-viewer',
        template: '',
        // TODO(robwormald): shadow DOM and emulated don't work here (?!)
        // encapsulation: ViewEncapsulation.Native
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, Logger, typeof (_b = typeof Title !== "undefined" && Title) === "function" ? _b : Object, typeof (_c = typeof Meta !== "undefined" && Meta) === "function" ? _c : Object, TocService,
        ElementsLoader])
], DocViewerComponent);
export { DocViewerComponent };
