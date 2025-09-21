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
var _a;
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { ScrollSpyService } from 'app/shared/scroll-spy.service';
let TocService = class TocService {
    document;
    domSanitizer;
    scrollSpyService;
    tocList = new ReplaySubject(1);
    activeItemIndex = new ReplaySubject(1);
    scrollSpyInfo = null;
    constructor(document, domSanitizer, scrollSpyService) {
        this.document = document;
        this.domSanitizer = domSanitizer;
        this.scrollSpyService = scrollSpyService;
    }
    genToc(docElement, docId = '') {
        this.resetScrollSpyInfo();
        if (!docElement) {
            this.tocList.next([]);
            return;
        }
        const headings = this.findTocHeadings(docElement);
        const idMap = new Map();
        const tocList = headings.map((heading) => ({
            content: this.extractHeadingSafeHtml(heading),
            href: `${docId}#${this.getId(heading, idMap)}`,
            level: heading.tagName.toLowerCase(),
            title: (heading.textContent || '').trim(),
        }));
        this.tocList.next(tocList);
        this.scrollSpyInfo = this.scrollSpyService.spyOn(headings);
        this.scrollSpyInfo.active.subscribe((item) => this.activeItemIndex.next(item && item.index));
    }
    reset() {
        this.resetScrollSpyInfo();
        this.tocList.next([]);
    }
    // This bad boy exists only to strip off the anchor link attached to a heading
    extractHeadingSafeHtml(heading) {
        const div = this.document.createElement('div');
        div.innerHTML = heading.innerHTML;
        const anchorLinks = div.querySelectorAll('a');
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < anchorLinks.length; i++) {
            const anchorLink = anchorLinks[i];
            if (!anchorLink.classList.contains('header-link')) {
                // this is an anchor that contains actual content that we want to keep
                // move the contents of the anchor into its parent
                const parent = anchorLink.parentNode;
                while (anchorLink.childNodes.length) {
                    parent.insertBefore(anchorLink.childNodes[0], anchorLink);
                }
            }
            // now remove the anchor
            anchorLink.remove();
        }
        // security: the document element which provides this heading content
        // is always authored by the documentation team and is considered to be safe
        return this.domSanitizer.bypassSecurityTrustHtml(div.innerHTML.trim());
    }
    findTocHeadings(docElement) {
        const headings = docElement.querySelectorAll('h1,h2,h3');
        const skipNoTocHeadings = (heading) => !/(?:no-toc|notoc)/i.test(heading.className);
        return Array.prototype.filter.call(headings, skipNoTocHeadings);
    }
    resetScrollSpyInfo() {
        if (this.scrollSpyInfo) {
            this.scrollSpyInfo.unspy();
            this.scrollSpyInfo = null;
        }
        this.activeItemIndex.next(null);
    }
    // Extract the id from the heading; create one if necessary
    // Is it possible for a heading to lack an id?
    getId(h, idMap) {
        let id = h.id;
        if (id) {
            addToMap(id);
        }
        else {
            id = (h.textContent || '').trim().toLowerCase().replace(/\W+/g, '-');
            id = addToMap(id);
            h.id = id;
        }
        return id;
        // Map guards against duplicate id creation.
        function addToMap(key) {
            const oldCount = idMap.get(key) || 0;
            const count = oldCount + 1;
            idMap.set(key, count);
            return count === 1 ? key : `${key}-${count}`;
        }
    }
};
TocService = __decorate([
    Injectable(),
    __param(0, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof DomSanitizer !== "undefined" && DomSanitizer) === "function" ? _a : Object, ScrollSpyService])
], TocService);
export { TocService };
