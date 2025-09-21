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
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { WindowToken } from 'app/shared/window';
let GaService = class GaService {
    window;
    previousUrl;
    constructor(window) {
        this.window = window;
        this.ga('create', environment.gaId, 'auto');
    }
    locationChanged(url) {
        this.sendPage(url);
    }
    sendPage(url) {
        // Won't re-send if the url hasn't changed.
        if (url === this.previousUrl) {
            return;
        }
        this.previousUrl = url;
        this.ga('set', 'page', '/' + url);
        this.ga('send', 'pageview');
    }
    sendEvent(source, action, label, value) {
        this.ga('send', 'event', source, action, label, value);
    }
    ga(...args) {
        const gaFn = this.window.ga;
        if (gaFn) {
            gaFn(...args);
        }
    }
};
GaService = __decorate([
    Injectable()
    /**
     * Google Analytics Service - captures app behaviors and sends them to Google Analytics (GA).
     * Presupposes that GA script has been loaded from a script on the host web page.
     * Associates data with a GA "property" from the environment (`gaId`).
     */
    ,
    __param(0, Inject(WindowToken)),
    __metadata("design:paramtypes", [Window])
], GaService);
export { GaService };
