import { Observable, ReplaySubject } from 'rxjs';
import { ScrollService } from 'app/shared/scroll.service';
export interface ScrollItem {
    element: Element;
    index: number;
}
export interface ScrollSpyInfo {
    active: Observable<ScrollItem | null>;
    unspy: () => void;
}
export declare class ScrollSpiedElement implements ScrollItem {
    readonly element: Element;
    readonly index: number;
    top: number;
    constructor(element: Element, index: number);
    calculateTop(scrollTop: number, topOffset: number): void;
}
export declare class ScrollSpiedElementGroup {
    activeScrollItem: ReplaySubject<ScrollItem | null>;
    private spiedElements;
    constructor(elements: Element[]);
    calibrate(scrollTop: number, topOffset: number): void;
    onScroll(scrollTop: number, maxScrollTop: number): void;
}
export declare class ScrollSpyService {
    private doc;
    private scrollService;
    private spiedElementGroups;
    private onStopListening;
    private resizeEvents;
    private scrollEvents;
    private lastContentHeight;
    private lastMaxScrollTop;
    constructor(doc: any, scrollService: ScrollService);
    spyOn(elements: Element[]): ScrollSpyInfo;
    private getContentHeight;
    private getScrollTop;
    private getTopOffset;
    private getViewportHeight;
    private onResize;
    private onScroll;
    private unspy;
}
