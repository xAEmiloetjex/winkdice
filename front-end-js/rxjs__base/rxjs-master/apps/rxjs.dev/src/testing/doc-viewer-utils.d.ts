import { Observable } from 'rxjs';
import { DocumentContents } from 'app/documents/document.service';
import { DocViewerComponent } from 'app/layout/doc-viewer/doc-viewer.component';
export declare class TestDocViewerComponent extends DocViewerComponent {
    currViewContainer: HTMLElement;
    nextViewContainer: HTMLElement;
    prepareTitleAndToc(targetElem: HTMLElement, docId: string): () => void;
    render(doc: DocumentContents): Observable<void>;
    swapViews(onInsertedCb?: () => void): Observable<void>;
}
export declare class TestParentComponent {
    currentDoc?: DocumentContents | null;
    docViewer: DocViewerComponent;
}
export declare class MockTitle {
    setTitle: any;
}
export declare class MockMeta {
    addTag: any;
    removeTag: any;
}
export declare class MockTocService {
    genToc: any;
    reset: any;
}
export declare class MockElementsLoader {
    loadContainedCustomElements: any;
}
export declare class TestModule {
}
export declare class ObservableWithSubscriptionSpies<T = void> extends Observable<T> {
    unsubscribeSpies: jasmine.Spy[];
    subscribeSpy: any;
    constructor(subscriber?: () => any);
}
