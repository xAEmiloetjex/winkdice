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
import { Contributor } from './contributors.model';
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
let ContributorComponent = class ContributorComponent {
    person;
    noPicture = '_no-one.png';
    pictureBase = CONTENT_URL_PREFIX + 'images/bios/';
    flipCard(person) {
        person.isFlipped = !person.isFlipped;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Contributor)
], ContributorComponent.prototype, "person", void 0);
ContributorComponent = __decorate([
    Component({
        selector: 'aio-contributor',
        template: `
    <div [ngClass]="{ 'flipped': person.isFlipped }" class="contributor-card">

        <div class="card-front">
            <h3>{{person.name}}</h3>

            <div class="contributor-image" [style.background-image]="'url('+(person.picture || noPicture)+')'">
                <div class="contributor-info">
                    <a *ngIf="person.bio" mat-button>
                        View Bio
                    </a>
                    <a *ngIf="person.twitter" mat-button class="icon"
                        href="{{person.twitter}}" target="_blank" (click)="$event.stopPropagation()">
                        <span class="fa fa-twitter fa-2x" aria-hidden="true"></span>
                        <span class="sr-only">Twitter {{person.name}}</span>
                    </a>
                    <a *ngIf="person.github" mat-button class="icon"
                        href="{{person.github}}" target="_blank" (click)="$event.stopPropagation()">
                        <span class="fa fa-github fa-2x" aria-hidden="true"></span>
                        <span class="sr-only">GitHub {{person.name}}</span>
                    </a>
                    <a *ngIf="person.website" mat-button class="icon"
                        href="{{person.website}}" target="_blank" (click)="$event.stopPropagation()">
                        <span class="fa fa-link fa-2x" aria-hidden="true"></span>
                        <span class="sr-only">Personal website {{person.name}}</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events -->
        <div class="card-back" *ngIf="person.isFlipped" (click)="flipCard(person)">
            <h3>{{person.name}}</h3>
            <p class="contributor-bio">{{person.bio}}</p>
        </div>
    </div>
  `,
    })
], ContributorComponent);
export { ContributorComponent };
