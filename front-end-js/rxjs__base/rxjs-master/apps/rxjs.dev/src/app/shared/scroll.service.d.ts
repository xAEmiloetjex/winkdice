import { Location, PlatformLocation, ViewportScroller } from '@angular/common';
type ScrollPosition = [number, number];
export declare const topMargin = 16;
/**
 * A service that scrolls document elements into view
 */
export declare class ScrollService {
    private document;
    private platformLocation;
    private viewportScroller;
    private location;
    private _topOffset;
    private _topOfPageElement;
    poppedStateScrollPosition: ScrollPosition | null;
    supportManualScrollRestoration: boolean;
    get topOffset(): number;
    get topOfPageElement(): Element;
    constructor(document: any, platformLocation: PlatformLocation, viewportScroller: ViewportScroller, location: Location);
    /**
     * Scroll to the element with id extracted from the current location hash fragment.
     * Scroll to top if no hash.
     * Don't scroll if hash not found.
     */
    scroll(): void;
    /**
     * test if the current location has a hash
     */
    isLocationWithHash(): boolean;
    /**
     * When we load a document, we have to scroll to the correct position depending on whether this is a new location,
     * a back/forward in the history, or a refresh
     *
     * @param delay before we scroll to the good position
     */
    scrollAfterRender(delay: number): void;
    /**
     * Scroll to the element.
     * Don't scroll if no element.
     */
    scrollToElement(element: Element | null): void;
    /** Scroll to the top of the document. */
    scrollToTop(): void;
    scrollToPosition(): void;
    /**
     * Update the state with scroll position into history.
     */
    updateScrollPositionInHistory(): void;
    getStoredScrollPosition(): ScrollPosition | null;
    removeStoredScrollPosition(): void;
    /**
     * Check if the scroll position need to be manually fixed after popState event
     */
    needToFixScrollPosition(): boolean;
    /**
     * Return the hash fragment from the `PlatformLocation`, minus the leading `#`.
     */
    private getCurrentHash;
}
export {};
