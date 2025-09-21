import { AfterViewInit, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ScrollService } from 'app/shared/scroll.service';
import { TocItem, TocService } from 'app/shared/toc.service';
type TocType = 'None' | 'Floating' | 'EmbeddedSimple' | 'EmbeddedExpandable';
export declare class TocComponent implements OnInit, AfterViewInit, OnDestroy {
    private scrollService;
    private tocService;
    activeIndex: number | null;
    type: TocType;
    isCollapsed: boolean;
    isEmbedded: boolean;
    private items;
    private onDestroy;
    primaryMax: number;
    tocList: TocItem[];
    constructor(scrollService: ScrollService, elementRef: ElementRef, tocService: TocService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    toggle(canScroll?: boolean): void;
    toTop(): void;
}
export {};
