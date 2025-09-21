var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgModule, ViewChild, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DocViewerComponent } from 'app/layout/doc-viewer/doc-viewer.component';
import { Logger } from 'app/shared/logger.service';
import { TocService } from 'app/shared/toc.service';
import { MockLogger } from 'testing/logger.service';
import { ElementsLoader } from 'app/custom-elements/elements-loader';
////////////////////////////////////////////////////////////////////////////////////////////////////
/// `TestDocViewerComponent` (for exposing internal `DocViewerComponent` methods as public).     ///
/// Only used for type-casting; the actual implementation is irrelevant.                         ///
////////////////////////////////////////////////////////////////////////////////////////////////////
export class TestDocViewerComponent extends DocViewerComponent {
    currViewContainer;
    nextViewContainer;
    prepareTitleAndToc(targetElem, docId) { return null; }
    render(doc) { return null; }
    swapViews(onInsertedCb) { return null; }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
/// `TestModule` and `TestParentComponent`.                                                      ///
////////////////////////////////////////////////////////////////////////////////////////////////////
// Test parent component.
let TestParentComponent = class TestParentComponent {
    currentDoc;
    docViewer;
};
__decorate([
    ViewChild(DocViewerComponent),
    __metadata("design:type", DocViewerComponent)
], TestParentComponent.prototype, "docViewer", void 0);
TestParentComponent = __decorate([
    Component({
        selector: 'aio-test',
        template: '<aio-doc-viewer [doc]="currentDoc">Test Component</aio-doc-viewer>',
    })
], TestParentComponent);
export { TestParentComponent };
// Mock services.
let MockTitle = class MockTitle {
    setTitle = jasmine.createSpy('Title#reset');
};
MockTitle = __decorate([
    Injectable()
], MockTitle);
export { MockTitle };
let MockMeta = class MockMeta {
    addTag = jasmine.createSpy('Meta#addTag');
    removeTag = jasmine.createSpy('Meta#removeTag');
};
MockMeta = __decorate([
    Injectable()
], MockMeta);
export { MockMeta };
let MockTocService = class MockTocService {
    genToc = jasmine.createSpy('TocService#genToc');
    reset = jasmine.createSpy('TocService#reset');
};
MockTocService = __decorate([
    Injectable()
], MockTocService);
export { MockTocService };
let MockElementsLoader = class MockElementsLoader {
    loadContainedCustomElements = jasmine.createSpy('MockElementsLoader#loadContainedCustomElements');
};
MockElementsLoader = __decorate([
    Injectable()
], MockElementsLoader);
export { MockElementsLoader };
let TestModule = class TestModule {
};
TestModule = __decorate([
    NgModule({
        declarations: [
            DocViewerComponent,
            TestParentComponent,
        ],
        providers: [
            { provide: Logger, useClass: MockLogger },
            { provide: Title, useClass: MockTitle },
            { provide: Meta, useClass: MockMeta },
            { provide: TocService, useClass: MockTocService },
            { provide: ElementsLoader, useClass: MockElementsLoader },
        ],
    })
], TestModule);
export { TestModule };
////////////////////////////////////////////////////////////////////////////////////////////////////
/// An observable with spies to test subscribing/unsubscribing.                                  ///
////////////////////////////////////////////////////////////////////////////////////////////////////
export class ObservableWithSubscriptionSpies extends Observable {
    unsubscribeSpies = [];
    subscribeSpy = spyOn(this, 'subscribe').and.callFake((...args) => {
        const subscription = super.subscribe(...args);
        const unsubscribeSpy = spyOn(subscription, 'unsubscribe').and.callThrough();
        this.unsubscribeSpies.push(unsubscribeSpy);
        return subscription;
    });
    constructor(subscriber = () => undefined) { super(subscriber); }
}
