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
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
let SelectComponent = class SelectComponent {
    hostElement;
    selected;
    options;
    // eslint-disable-next-line @angular-eslint/no-output-native
    change = new EventEmitter();
    showSymbol = false;
    label;
    showOptions = false;
    constructor(hostElement) {
        this.hostElement = hostElement;
    }
    ngOnInit() {
        this.label = this.label || '';
    }
    toggleOptions() {
        this.showOptions = !this.showOptions;
    }
    hideOptions() {
        this.showOptions = false;
    }
    select(option, index) {
        this.selected = option;
        this.change.emit({ option, index });
        this.hideOptions();
    }
    onClick(eventTarget) {
        // Hide the options if we clicked outside the component
        if (!this.hostElement.nativeElement.contains(eventTarget)) {
            this.hideOptions();
        }
    }
    onKeyDown() {
        this.hideOptions();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], SelectComponent.prototype, "selected", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], SelectComponent.prototype, "options", void 0);
__decorate([
    Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
    ,
    __metadata("design:type", Object)
], SelectComponent.prototype, "change", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], SelectComponent.prototype, "showSymbol", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], SelectComponent.prototype, "label", void 0);
__decorate([
    HostListener('document:click', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HTMLElement]),
    __metadata("design:returntype", void 0)
], SelectComponent.prototype, "onClick", null);
__decorate([
    HostListener('document:keydown.escape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SelectComponent.prototype, "onKeyDown", null);
SelectComponent = __decorate([
    Component({
        selector: 'aio-select',
        template: `<div class="form-select-menu">
    <button class="form-select-button" (click)="toggleOptions()">
      <strong>{{ label }}</strong
      ><span *ngIf="showSymbol" class="symbol {{ selected?.value }}"></span>{{ selected?.title }}
    </button>
    <ul class="form-select-dropdown" *ngIf="showOptions">
      <li
        *ngFor="let option of options; index as i"
        [class.selected]="option === selected"
        role="button"
        tabindex="0"
        (click)="select(option, i)"
        (keydown.enter)="select(option, i)"
        (keydown.space)="select(option, i); $event.preventDefault()"
      >
        <span *ngIf="showSymbol" class="symbol {{ option.value }}"></span>{{ option.title }}
      </li>
    </ul>
  </div>`,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object])
], SelectComponent);
export { SelectComponent };
