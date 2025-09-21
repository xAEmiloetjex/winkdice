var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Component, ElementRef, Input } from '@angular/core';
import { Logger } from 'app/shared/logger.service';
import { ElementsLoader } from './elements-loader';
let LazyCustomElementComponent = class LazyCustomElementComponent {
    elementRef;
    elementsLoader;
    logger;
    selector = '';
    constructor(elementRef, elementsLoader, logger) {
        this.elementRef = elementRef;
        this.elementsLoader = elementsLoader;
        this.logger = logger;
    }
    ngOnInit() {
        if (!this.selector || /[^\w-]/.test(this.selector)) {
            this.logger.error(new Error(`Invalid selector for 'aio-lazy-ce': ${this.selector}`));
            return;
        }
        this.elementRef.nativeElement.innerHTML = `<${this.selector}></${this.selector}>`;
        this.elementsLoader.loadCustomElement(this.selector);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], LazyCustomElementComponent.prototype, "selector", void 0);
LazyCustomElementComponent = __decorate([
    Component({
        selector: 'aio-lazy-ce',
        template: '',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, ElementsLoader,
        Logger])
], LazyCustomElementComponent);
export { LazyCustomElementComponent };
