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
import { animate, state, style, trigger, transition } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Inject, Input, Output } from '@angular/core';
import { CurrentDateToken } from 'app/shared/current-date';
import { WindowToken } from 'app/shared/window';
const LOCAL_STORAGE_NAMESPACE = 'aio-notification/';
let NotificationComponent = class NotificationComponent {
    currentDate;
    storage;
    dismissOnContentClick;
    notificationId;
    expirationDate;
    dismissed = new EventEmitter();
    showNotification;
    constructor(window, currentDate) {
        this.currentDate = currentDate;
        try {
            this.storage = window.localStorage;
        }
        catch {
            // When cookies are disabled in the browser, even trying to access
            // `window.localStorage` throws an error. Use a no-op storage.
            this.storage = {
                length: 0,
                clear: () => undefined,
                getItem: () => null,
                key: () => null,
                removeItem: () => undefined,
                setItem: () => undefined,
            };
        }
    }
    ngOnInit() {
        const previouslyHidden = this.storage.getItem(LOCAL_STORAGE_NAMESPACE + this.notificationId) === 'hide';
        const expired = this.currentDate > new Date(this.expirationDate);
        this.showNotification = previouslyHidden || expired ? 'hide' : 'show';
    }
    contentClick() {
        if (this.dismissOnContentClick) {
            this.dismiss();
        }
    }
    dismiss() {
        this.storage.setItem(LOCAL_STORAGE_NAMESPACE + this.notificationId, 'hide');
        this.showNotification = 'hide';
        this.dismissed.next(null);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], NotificationComponent.prototype, "dismissOnContentClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], NotificationComponent.prototype, "notificationId", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], NotificationComponent.prototype, "expirationDate", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], NotificationComponent.prototype, "dismissed", void 0);
__decorate([
    HostBinding('@hideAnimation'),
    __metadata("design:type", String)
], NotificationComponent.prototype, "showNotification", void 0);
NotificationComponent = __decorate([
    Component({
        selector: 'aio-notification',
        template: `
  <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events -->
  <span class="content" (click)="contentClick()">
      <ng-content></ng-content>
    </span>

    <button mat-icon-button class="close-button" aria-label="Close" (click)="dismiss()">
      <mat-icon svgIcon="close" aria-label="Dismiss notification"></mat-icon>
    </button> `,
        animations: [
            trigger('hideAnimation', [
                state('show', style({ height: '*' })),
                state('hide', style({ height: 0 })),
                // this should be kept in sync with the animation durations in:
                // - aio/src/styles/2-modules/_notification.scss
                // - aio/src/app/app.component.ts : notificationDismissed()
                transition('show => hide', animate(250)),
            ]),
        ],
    }),
    __param(0, Inject(WindowToken)),
    __param(1, Inject(CurrentDateToken)),
    __metadata("design:paramtypes", [Window, Date])
], NotificationComponent);
export { NotificationComponent };
