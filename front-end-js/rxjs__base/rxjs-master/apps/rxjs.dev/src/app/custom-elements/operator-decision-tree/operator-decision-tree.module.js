var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { ScrollService } from 'app/shared/scroll.service';
import { OperatorDecisionTreeDataService } from './operator-decision-tree-data.service';
import { OperatorDecisionTreeComponent } from './operator-decision-tree.component';
import { OperatorDecisionTreeService } from './operator-decision-tree.service';
let OperatorDecisionTreeModule = class OperatorDecisionTreeModule {
    customElementComponent = OperatorDecisionTreeComponent;
};
OperatorDecisionTreeModule = __decorate([
    NgModule({
        imports: [CommonModule, MatButtonModule, MatCardModule, MatRippleModule],
        declarations: [OperatorDecisionTreeComponent],
        providers: [
            OperatorDecisionTreeDataService,
            OperatorDecisionTreeService,
            ScrollService
        ]
    })
], OperatorDecisionTreeModule);
export { OperatorDecisionTreeModule };
