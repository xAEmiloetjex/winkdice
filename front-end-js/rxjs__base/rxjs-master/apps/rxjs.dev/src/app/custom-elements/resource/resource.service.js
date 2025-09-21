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
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
const resourcesPath = CONTENT_URL_PREFIX + 'resources.json';
let ResourceService = class ResourceService {
    http;
    categories;
    constructor(http) {
        this.http = http;
        this.categories = this.getCategories();
    }
    getCategories() {
        const categories = this.http.get(resourcesPath).pipe(map(data => mkCategories(data)), publishLast());
        categories.connect();
        return categories;
    }
    ;
};
ResourceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object])
], ResourceService);
export { ResourceService };
// Extract sorted Category[] from resource JSON data
function mkCategories(categoryJson) {
    return Object.keys(categoryJson).map(catKey => {
        const cat = categoryJson[catKey];
        return {
            id: makeId(catKey),
            title: catKey,
            order: cat.order,
            subCategories: mkSubCategories(cat.subCategories, catKey)
        };
    })
        .sort(compareCats);
}
// Extract sorted SubCategory[] from JSON category data
function mkSubCategories(subCategoryJson, catKey) {
    return Object.keys(subCategoryJson).map(subKey => {
        const sub = subCategoryJson[subKey];
        return {
            id: makeId(subKey),
            title: subKey,
            order: sub.order,
            resources: mkResources(sub.resources, subKey, catKey)
        };
    })
        .sort(compareCats);
}
// Extract sorted Resource[] from JSON subcategory data
function mkResources(resourceJson, subKey, catKey) {
    return Object.keys(resourceJson).map(resKey => {
        const res = resourceJson[resKey];
        res.category = catKey;
        res.subCategory = subKey;
        res.id = makeId(resKey);
        return res;
    })
        .sort(compareTitles);
}
function compareCats(l, r) {
    return l.order === r.order ? compareTitles(l, r) : l.order > r.order ? 1 : -1;
}
function compareTitles(l, r) {
    return l.title.toUpperCase() > r.title.toUpperCase() ? 1 : -1;
}
function makeId(title) {
    return title.toLowerCase().replace(/\s+/g, '-');
}
