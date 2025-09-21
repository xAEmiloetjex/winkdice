var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
let FooterComponent = class FooterComponent {
    nodes;
    versionInfo;
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], FooterComponent.prototype, "nodes", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FooterComponent.prototype, "versionInfo", void 0);
FooterComponent = __decorate([
    Component({
        selector: 'aio-footer',
        template: `<p>
      Code licensed under an <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache-2.0 License</a>. Documentation licensed under
      <a href="http://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
    </p>
    <p>Version {{ versionInfo?.full }}.</p>`,
    })
], FooterComponent);
export { FooterComponent };
