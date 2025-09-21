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
var _a, _b;
import { Compiler, Inject, Injectable, NgModuleFactory, NgModuleRef, } from '@angular/core';
import { ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN } from './element-registry';
import { from, of } from 'rxjs';
import { createCustomElement } from '@angular/elements';
let ElementsLoader = class ElementsLoader {
    moduleRef;
    compiler;
    /** Map of unregistered custom elements and their respective module paths to load. */
    elementsToLoad;
    /** Map of custom elements that are in the process of being loaded and registered. */
    elementsLoading = new Map();
    constructor(moduleRef, elementModulePaths, compiler) {
        this.moduleRef = moduleRef;
        this.compiler = compiler;
        this.elementsToLoad = new Map(elementModulePaths);
    }
    /**
     * Queries the provided element for any custom elements that have not yet been registered with
     * the browser. Custom elements that are registered will be removed from the list of unregistered
     * elements so that they will not be queried in subsequent calls.
     */
    loadContainedCustomElements(element) {
        const unregisteredSelectors = Array.from(this.elementsToLoad.keys())
            .filter(s => element.querySelector(s));
        if (!unregisteredSelectors.length) {
            return of(undefined);
        }
        // Returns observable that completes when all discovered elements have been registered.
        const allRegistered = Promise.all(unregisteredSelectors.map(s => this.loadCustomElement(s)));
        return from(allRegistered.then(() => undefined));
    }
    /** Loads and registers the custom element defined on the `WithCustomElement` module factory. */
    loadCustomElement(selector) {
        if (this.elementsLoading.has(selector)) {
            // The custom element is in the process of being loaded and registered.
            return this.elementsLoading.get(selector);
        }
        if (this.elementsToLoad.has(selector)) {
            // Load and register the custom element (for the first time).
            const modulePathLoader = this.elementsToLoad.get(selector);
            const loadedAndRegistered = modulePathLoader()
                .then(elementModuleOrFactory => {
                /**
                 * With View Engine, the NgModule factory is created and provided when loaded.
                 * With Ivy, only the NgModule class is provided loaded and must be compiled.
                 * This uses the same mechanism as the deprecated `SystemJsNgModuleLoader` in
                 * in `packages/core/src/linker/system_js_ng_module_factory_loader.ts`
                 * to pass on the NgModuleFactory, or compile the NgModule and return its NgModuleFactory.
                 */
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    return elementModuleOrFactory;
                }
                else {
                    return this.compiler.compileModuleAsync(elementModuleOrFactory);
                }
            })
                .then(elementModuleFactory => {
                const elementModuleRef = elementModuleFactory.create(this.moduleRef.injector);
                const injector = elementModuleRef.injector;
                const CustomElementComponent = elementModuleRef.instance.customElementComponent;
                const CustomElement = createCustomElement(CustomElementComponent, { injector });
                customElements.define(selector, CustomElement);
                return customElements.whenDefined(selector);
            })
                .then(() => {
                // The custom element has been successfully loaded and registered.
                // Remove from `elementsLoading` and `elementsToLoad`.
                this.elementsLoading.delete(selector);
                this.elementsToLoad.delete(selector);
            })
                .catch(err => {
                // The custom element has failed to load and register.
                // Remove from `elementsLoading`.
                // (Do not remove from `elementsToLoad` in case it was a temporary error.)
                this.elementsLoading.delete(selector);
                return Promise.reject(err);
            });
            this.elementsLoading.set(selector, loadedAndRegistered);
            return loadedAndRegistered;
        }
        // The custom element has already been loaded and registered.
        return Promise.resolve();
    }
};
ElementsLoader = __decorate([
    Injectable(),
    __param(1, Inject(ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN)),
    __metadata("design:paramtypes", [typeof (_a = typeof NgModuleRef !== "undefined" && NgModuleRef) === "function" ? _a : Object, Map, typeof (_b = typeof Compiler !== "undefined" && Compiler) === "function" ? _b : Object])
], ElementsLoader);
export { ElementsLoader };
