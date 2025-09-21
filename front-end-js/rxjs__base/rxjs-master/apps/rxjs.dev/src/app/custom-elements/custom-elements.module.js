var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { ROUTES } from '@angular/router';
import { ElementsLoader } from './elements-loader';
import { ELEMENT_MODULE_LOAD_CALLBACKS, ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES, ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN } from './element-registry';
import { LazyCustomElementComponent } from './lazy-custom-element.component';
let CustomElementsModule = class CustomElementsModule {
};
CustomElementsModule = __decorate([
    NgModule({
        declarations: [LazyCustomElementComponent],
        exports: [LazyCustomElementComponent],
        providers: [
            ElementsLoader,
            { provide: ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN, useValue: ELEMENT_MODULE_LOAD_CALLBACKS },
            // Providing these routes as a signal to the build system that these modules should be
            // registered as lazy-loadable.
            // TODO(andrewjs): Provide first-class support for providing this.
            { provide: ROUTES, useValue: ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES, multi: true },
        ],
    })
], CustomElementsModule);
export { CustomElementsModule };
