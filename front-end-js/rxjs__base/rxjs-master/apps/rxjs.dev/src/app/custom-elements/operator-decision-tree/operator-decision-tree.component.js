var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ScrollService } from 'app/shared/scroll.service';
import { OperatorDecisionTreeService } from './operator-decision-tree.service';
let OperatorDecisionTreeComponent = class OperatorDecisionTreeComponent {
    operatorDecisionTreeService;
    scrollService;
    currentSentence$ = this.operatorDecisionTreeService.currentSentence$;
    options$ = this.operatorDecisionTreeService.options$;
    isBeyondInitialQuestion$ = this.operatorDecisionTreeService.isBeyondInitialQuestion$;
    hasError$ = this.operatorDecisionTreeService.hasError$;
    constructor(operatorDecisionTreeService, scrollService) {
        this.operatorDecisionTreeService = operatorDecisionTreeService;
        this.scrollService = scrollService;
    }
    selectOption(optionId) {
        this.operatorDecisionTreeService.selectOption(optionId);
        this.scrollService.scrollToTop();
    }
    back() {
        this.operatorDecisionTreeService.back();
    }
    startOver() {
        this.operatorDecisionTreeService.startOver();
    }
    ngOnDestroy() {
        this.startOver();
    }
};
OperatorDecisionTreeComponent = __decorate([
    Component({
        selector: 'aio-operator-decision-tree',
        template: `
    <h1 class="mat-heading" tabindex="0">Operator Decision Tree</h1>
    <ng-container *ngIf="(hasError$ | async) === false; else hasErrorTemplate">
      <h2 class="mat-subheading-2" tabindex="0">
        {{ currentSentence$ | async }}
      </h2>
      <ng-container *ngIf="isBeyondInitialQuestion$ | async">
        <section>
          <button (click)="back()" mat-button class="back">Back</button>
          <button (click)="startOver()" mat-button color="warn" class="start-over">Start Over</button>
        </section>
      </ng-container>
      <div>
        <ng-container *ngFor="let option of options$ | async">
          <ng-container *ngIf="option.options; else operatorTemplate">
            <button class="option mat-body-1" (click)="selectOption(option.id)" [@flyIn]>
              <mat-card matRipple>
                {{ option.label }}
              </mat-card>
            </button>
          </ng-container>
          <ng-template #operatorTemplate>
            <p *ngIf="option.method" class="mat-body-1">
              You want the {{ option.method }} of the {{ option.docType }}
              <a href="{{ option.path }}#{{ option.method }}">{{ option.label }}</a
              >.
            </p>
            <p *ngIf="!option.method" class="mat-body-1">
              You want the {{ option.docType }} <a href="{{ option.path }}">{{ option.label }}</a
              >.
            </p>
          </ng-template>
        </ng-container>
      </div>
    </ng-container>

    <ng-template #hasErrorTemplate>
      <div class="mat-body-1 error">
        <p>Oops! There was an issue loading the decision tree.. we're real sorry about that. Please try reloading the page.</p>
        <p>
          You can also try
          <a href="https://github.com/ReactiveX/rxjs/issues/new?template=documentation.md" target="_blank">submitting an issue on GitHub</a
          >.
        </p>
      </div>
    </ng-template>
  `,
        styleUrls: ['./operator-decision-tree.component.scss'],
        animations: [
            trigger('flyIn', [
                state('in', style({ transform: 'translateX(0)' })),
                transition(':enter', [style({ transform: 'translateX(-100%)' }), animate(250)]),
            ]),
        ],
    }),
    __metadata("design:paramtypes", [OperatorDecisionTreeService, ScrollService])
], OperatorDecisionTreeComponent);
export { OperatorDecisionTreeComponent };
