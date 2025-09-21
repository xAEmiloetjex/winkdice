var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, NEVER, Subject } from 'rxjs';
import { first, map, takeUntil, tap } from 'rxjs/operators';
import { Logger } from 'app/shared/logger.service';
/**
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 6 hours.
 * 3. Whenever an update is available, it activates the update.
 *
 * @property
 * `updateActivated` {Observable<string>} - Emit the version hash whenever an update is activated.
 */
let SwUpdatesService = class SwUpdatesService {
    logger;
    swu;
    checkInterval = 1000 * 60 * 60 * 6; // 6 hours
    onDestroy = new Subject();
    updateActivated;
    constructor(appRef, logger, swu) {
        this.logger = logger;
        this.swu = swu;
        if (!swu.isEnabled) {
            this.updateActivated = NEVER.pipe(takeUntil(this.onDestroy));
            return;
        }
        // Periodically check for updates (after the app is stabilized).
        const appIsStable = appRef.isStable.pipe(first(v => v));
        concat(appIsStable, interval(this.checkInterval))
            .pipe(tap(() => this.log('Checking for update...')), takeUntil(this.onDestroy))
            .subscribe(() => this.swu.checkForUpdate());
        // Activate available updates.
        this.swu.available
            .pipe(tap(evt => this.log(`Update available: ${JSON.stringify(evt)}`)), takeUntil(this.onDestroy))
            .subscribe(() => this.swu.activateUpdate());
        // Notify about activated updates.
        this.updateActivated = this.swu.activated.pipe(tap(evt => this.log(`Update activated: ${JSON.stringify(evt)}`)), map(evt => evt.current.hash), takeUntil(this.onDestroy));
    }
    ngOnDestroy() {
        this.onDestroy.next();
    }
    log(message) {
        const timestamp = (new Date()).toISOString();
        this.logger.log(`[SwUpdates - ${timestamp}]: ${message}`);
    }
};
SwUpdatesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof ApplicationRef !== "undefined" && ApplicationRef) === "function" ? _a : Object, Logger, typeof (_b = typeof SwUpdate !== "undefined" && SwUpdate) === "function" ? _b : Object])
], SwUpdatesService);
export { SwUpdatesService };
