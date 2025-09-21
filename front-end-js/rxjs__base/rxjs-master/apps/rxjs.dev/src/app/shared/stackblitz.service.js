var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import StackBlitzkSDK from '@stackblitz/sdk';
import { Injectable } from '@angular/core';
let StackblitzService = class StackblitzService {
    openProject(config) {
        const codeExtension = {
            ts: 'ts',
            typescript: 'ts',
        }[config.language] || 'js';
        const template = codeExtension === 'ts' ? 'typescript' : 'javascript';
        StackBlitzkSDK.openProject({
            files: {
                'index.html': config.html || '',
                [`index.${codeExtension}`]: config.code,
            },
            title: 'RxJS example',
            description: 'RxJS example',
            template,
            tags: ['rxjs', 'demo'],
            dependencies: config.dependencies,
            settings: {
                compile: {
                    trigger: 'auto',
                    action: 'refresh',
                    clearConsole: true,
                },
            },
        }, {
            devToolsHeight: 50,
        });
    }
};
StackblitzService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], StackblitzService);
export { StackblitzService };
