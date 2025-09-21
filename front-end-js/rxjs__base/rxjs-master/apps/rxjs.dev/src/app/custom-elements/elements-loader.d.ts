import { Compiler, NgModuleRef } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadChildrenCallback } from '@angular/router';
export declare class ElementsLoader {
    private moduleRef;
    private compiler;
    /** Map of unregistered custom elements and their respective module paths to load. */
    private elementsToLoad;
    /** Map of custom elements that are in the process of being loaded and registered. */
    private elementsLoading;
    constructor(moduleRef: NgModuleRef<any>, elementModulePaths: Map<string, LoadChildrenCallback>, compiler: Compiler);
    /**
     * Queries the provided element for any custom elements that have not yet been registered with
     * the browser. Custom elements that are registered will be removed from the list of unregistered
     * elements so that they will not be queried in subsequent calls.
     */
    loadContainedCustomElements(element: HTMLElement): Observable<void>;
    /** Loads and registers the custom element defined on the `WithCustomElement` module factory. */
    loadCustomElement(selector: string): Promise<void>;
}
