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
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, ReplaySubject, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ScrollService } from 'app/shared/scroll.service';
/*
 * Represents a "scroll-spied" element. Contains info and methods for determining whether this
 * element is the active one (i.e. whether it has been scrolled passed), based on the window's
 * scroll position.
 *
 * @prop {Element} element - The element whose position relative to the viewport is tracked.
 * @prop {number}  index   - The index of the element in the original list of element (group).
 * @prop {number}  top     - The `scrollTop` value at which this element becomes active.
 */
export class ScrollSpiedElement {
    element;
    index;
    top = 0;
    /*
     * @constructor
     * @param {Element} element - The element whose position relative to the viewport is tracked.
     * @param {number}  index   - The index of the element in the original list of element (group).
     */
    constructor(element, index) {
        this.element = element;
        this.index = index;
    }
    /*
     * @method
     * Calculate the `top` value, i.e. the value of the `scrollTop` property at which this element
     * becomes active. The current implementation assumes that window is the scroll-container.
     *
     * @param {number} scrollTop - How much is window currently scrolled (vertically).
     * @param {number} topOffset - The distance from the top at which the element becomes active.
     */
    calculateTop(scrollTop, topOffset) {
        this.top = scrollTop + this.element.getBoundingClientRect().top - topOffset;
    }
}
/*
 * Represents a group of "scroll-spied" elements. Contains info and methods for efficiently
 * determining which element should be considered "active", i.e. which element has been scrolled
 * passed the top of the viewport.
 *
 * @prop {Observable<ScrollItem | null>} activeScrollItem - An observable that emits ScrollItem
 *     elements (containing the HTML element and its original index) identifying the latest "active"
 *     element from a list of elements.
 */
export class ScrollSpiedElementGroup {
    activeScrollItem = new ReplaySubject(1);
    spiedElements;
    /*
     * @constructor
     * @param {Element[]} elements - A list of elements whose position relative to the viewport will
     *     be tracked, in order to determine which one is "active" at any given moment.
     */
    constructor(elements) {
        this.spiedElements = elements.map((elem, i) => new ScrollSpiedElement(elem, i));
    }
    /*
     * @method
     * Calculate the `top` value of each ScrollSpiedElement of this group (based on te current
     * `scrollTop` and `topOffset` values), so that the active element can be later determined just by
     * comparing its `top` property with the then current `scrollTop`.
     *
     * @param {number} scrollTop - How much is window currently scrolled (vertically).
     * @param {number} topOffset - The distance from the top at which the element becomes active.
     */
    calibrate(scrollTop, topOffset) {
        this.spiedElements.forEach(spiedElem => spiedElem.calculateTop(scrollTop, topOffset));
        this.spiedElements.sort((a, b) => b.top - a.top); // Sort in descending `top` order.
    }
    /*
     * @method
     * Determine which element is the currently active one, i.e. the lower-most element that is
     * scrolled passed the top of the viewport (taking offsets into account) and emit it on
     * `activeScrollItem`.
     * If no element can be considered active, `null` is emitted instead.
     * If window is scrolled all the way to the bottom, then the lower-most element is considered
     * active even if it not scrolled passed the top of the viewport.
     *
     * @param {number} scrollTop    - How much is window currently scrolled (vertically).
     * @param {number} maxScrollTop - The maximum possible `scrollTop` (based on the viewport size).
     */
    onScroll(scrollTop, maxScrollTop) {
        let activeItem;
        if (scrollTop + 1 >= maxScrollTop) {
            activeItem = this.spiedElements[0];
        }
        else {
            this.spiedElements.some(spiedElem => {
                if (spiedElem.top <= scrollTop) {
                    activeItem = spiedElem;
                    return true;
                }
                return false;
            });
        }
        this.activeScrollItem.next(activeItem || null);
    }
}
let ScrollSpyService = class ScrollSpyService {
    doc;
    scrollService;
    spiedElementGroups = [];
    onStopListening = new Subject();
    resizeEvents = fromEvent(window, 'resize').pipe(auditTime(300), takeUntil(this.onStopListening));
    scrollEvents = fromEvent(window, 'scroll').pipe(auditTime(10), takeUntil(this.onStopListening));
    lastContentHeight;
    lastMaxScrollTop;
    constructor(doc, scrollService) {
        this.doc = doc;
        this.scrollService = scrollService;
    }
    /*
     * @method
     * Start tracking a group of elements and emitting active elements; i.e. elements that are
     * currently visible in the viewport. If there was no other group being spied, start listening for
     * `resize` and `scroll` events.
     *
     * @param {Element[]} elements - A list of elements to track.
     *
     * @return {ScrollSpyInfo} - An object containing the following properties:
     *     - `active`: An observable of distinct ScrollItems.
     *     - `unspy`: A method to stop tracking this group of elements.
     */
    spyOn(elements) {
        if (!this.spiedElementGroups.length) {
            this.resizeEvents.subscribe(() => this.onResize());
            this.scrollEvents.subscribe(() => this.onScroll());
            this.onResize();
        }
        const scrollTop = this.getScrollTop();
        const topOffset = this.getTopOffset();
        const maxScrollTop = this.lastMaxScrollTop;
        const spiedGroup = new ScrollSpiedElementGroup(elements);
        spiedGroup.calibrate(scrollTop, topOffset);
        spiedGroup.onScroll(scrollTop, maxScrollTop);
        this.spiedElementGroups.push(spiedGroup);
        return {
            active: spiedGroup.activeScrollItem.asObservable().pipe(distinctUntilChanged()),
            unspy: () => this.unspy(spiedGroup)
        };
    }
    getContentHeight() {
        return this.doc.body.scrollHeight || Number.MAX_SAFE_INTEGER;
    }
    getScrollTop() {
        return window && window.pageYOffset || 0;
    }
    getTopOffset() {
        return this.scrollService.topOffset + 50;
    }
    getViewportHeight() {
        return this.doc.body.clientHeight || 0;
    }
    /*
     * @method
     * The size of the window has changed. Re-calculate all affected values,
     * so that active elements can be determined efficiently on scroll.
     */
    onResize() {
        const contentHeight = this.getContentHeight();
        const viewportHeight = this.getViewportHeight();
        const scrollTop = this.getScrollTop();
        const topOffset = this.getTopOffset();
        this.lastContentHeight = contentHeight;
        this.lastMaxScrollTop = contentHeight - viewportHeight;
        this.spiedElementGroups.forEach(group => group.calibrate(scrollTop, topOffset));
    }
    /*
     * @method
     * Determine which element for each ScrollSpiedElementGroup is active. If the content height has
     * changed since last check, re-calculate all affected values first.
     */
    onScroll() {
        if (this.lastContentHeight !== this.getContentHeight()) {
            // Something has caused the scroll height to change.
            // (E.g. image downloaded, accordion expanded/collapsed etc.)
            this.onResize();
        }
        const scrollTop = this.getScrollTop();
        const maxScrollTop = this.lastMaxScrollTop;
        this.spiedElementGroups.forEach(group => group.onScroll(scrollTop, maxScrollTop));
    }
    /*
     * @method
     * Stop tracking this group of elements and emitting active elements. If there is no other group
     * being spied, stop listening for `resize` or `scroll` events.
     *
     * @param {ScrollSpiedElementGroup} spiedGroup - The group to stop tracking.
     */
    unspy(spiedGroup) {
        spiedGroup.activeScrollItem.complete();
        this.spiedElementGroups = this.spiedElementGroups.filter(group => group !== spiedGroup);
        if (!this.spiedElementGroups.length) {
            this.onStopListening.next(null);
        }
    }
};
ScrollSpyService = __decorate([
    Injectable(),
    __param(0, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Object, ScrollService])
], ScrollSpyService);
export { ScrollSpyService };
