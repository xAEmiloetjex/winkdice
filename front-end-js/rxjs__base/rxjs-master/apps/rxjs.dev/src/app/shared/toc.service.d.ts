import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ScrollSpyService } from 'app/shared/scroll-spy.service';
export interface TocItem {
    content: SafeHtml;
    href: string;
    isSecondary?: boolean;
    level: string;
    title: string;
}
export declare class TocService {
    private document;
    private domSanitizer;
    private scrollSpyService;
    tocList: any;
    activeItemIndex: any;
    private scrollSpyInfo;
    constructor(document: any, domSanitizer: DomSanitizer, scrollSpyService: ScrollSpyService);
    genToc(docElement?: Element, docId?: string): void;
    reset(): void;
    private extractHeadingSafeHtml;
    private findTocHeadings;
    private resetScrollSpyInfo;
    private getId;
}
