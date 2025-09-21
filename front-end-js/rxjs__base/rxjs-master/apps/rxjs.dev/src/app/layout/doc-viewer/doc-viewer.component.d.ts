import { ElementRef, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DocumentContents } from 'app/documents/document.service';
import { Logger } from 'app/shared/logger.service';
import { TocService } from 'app/shared/toc.service';
import { ElementsLoader } from 'app/custom-elements/elements-loader';
export declare const NO_ANIMATIONS = "no-animations";
export declare class DocViewerComponent implements OnDestroy {
    private logger;
    private titleService;
    private metaService;
    private tocService;
    private elementsLoader;
    static animationsEnabled: boolean;
    private hostElement;
    private void$;
    private onDestroy$;
    private docContents$;
    protected currViewContainer: HTMLElement;
    protected nextViewContainer: HTMLElement;
    set doc(newDoc: DocumentContents);
    docReady: any;
    docRemoved: any;
    docInserted: any;
    docRendered: any;
    constructor(elementRef: ElementRef, logger: Logger, titleService: Title, metaService: Meta, tocService: TocService, elementsLoader: ElementsLoader);
    ngOnDestroy(): void;
    /**
     * Prepare for setting the window title and ToC.
     * Return a function to actually set them.
     */
    protected prepareTitleAndToc(targetElem: HTMLElement, docId: string): () => void;
    /**
     * Add doc content to host element and build it out with embedded components.
     */
    protected render(doc: DocumentContents): Observable<void>;
    /**
     * Tell search engine crawlers whether to index this page
     */
    private setNoIndex;
    /**
     * Swap the views, removing `currViewContainer` and inserting `nextViewContainer`.
     * (At this point all content should be ready, including having loaded and instantiated embedded
     *  components.)
     *
     * Optionally, run a callback as soon as `nextViewContainer` has been inserted, but before the
     * entering animation has been completed. This is useful for work that needs to be done as soon as
     * the element has been attached to the DOM.
     */
    protected swapViews(onInsertedCb?: () => void): Observable<void>;
    private addDocumentMetaTags;
}
