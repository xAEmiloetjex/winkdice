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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, publishLast } from 'rxjs/operators';
// TODO(andrewjs): Look into changing this so that we don't import the service just to get the const
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
const contributorsPath = CONTENT_URL_PREFIX + 'contributors.json';
const knownGroups = ['Core Team', 'Learning Team', 'Alumn', 'Contributors'];
let ContributorService = class ContributorService {
    http;
    contributors;
    constructor(http) {
        this.http = http;
        this.contributors = this.getContributors();
    }
    getContributors() {
        const contributors = this.http.get(contributorsPath).pipe(
        // Create group map
        map(contribs => {
            const contribMap = {};
            Object.keys(contribs).forEach(key => {
                const contributor = contribs[key];
                const group = contributor.group;
                const contribGroup = contribMap[group];
                if (contribGroup) {
                    contribGroup.push(contributor);
                }
                else {
                    contribMap[group] = [contributor];
                }
            });
            return contribMap;
        }), 
        // Flatten group map into sorted group array of sorted contributors
        map(cmap => Object.keys(cmap).map(key => {
            const order = knownGroups.indexOf(key);
            return {
                name: key,
                order: order === -1 ? knownGroups.length : order,
                contributors: cmap[key].sort(compareContributors)
            };
        })
            .sort(compareGroups)), publishLast());
        contributors.connect();
        return contributors;
    }
};
ContributorService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object])
], ContributorService);
export { ContributorService };
function compareContributors(l, r) {
    return l.name.toUpperCase() > r.name.toUpperCase() ? 1 : -1;
}
function compareGroups(l, r) {
    return l.order === r.order ?
        (l.name > r.name ? 1 : -1) :
        l.order > r.order ? 1 : -1;
}
