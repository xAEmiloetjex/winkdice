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
import { combineLatest } from 'rxjs';
import { map, publishLast, publishReplay } from 'rxjs/operators';
import { LocationService } from 'app/shared/location.service';
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
const navigationPath = CONTENT_URL_PREFIX + 'navigation.json';
let NavigationService = class NavigationService {
    http;
    location;
    /**
     * An observable collection of NavigationNode trees, which can be used to render navigational menus
     */
    navigationViews;
    /**
     * The current version of doc-app that we are running
     */
    versionInfo;
    /**
     * An observable of the current node with info about the
     * node (if any) that matches the current URL location
     * including its navigation view and its ancestor nodes in that view
     */
    currentNodes;
    constructor(http, location) {
        this.http = http;
        this.location = location;
        const navigationInfo = this.fetchNavigationInfo();
        this.navigationViews = this.getNavigationViews(navigationInfo);
        this.currentNodes = this.getCurrentNodes(this.navigationViews);
        // The version information is packaged inside the navigation response to save us an extra request.
        this.versionInfo = this.getVersionInfo(navigationInfo);
    }
    /**
     * Get an observable that fetches the `NavigationResponse` from the server.
     * We create an observable by calling `http.get` but then publish it to share the result
     * among multiple subscribers, without triggering new requests.
     * We use `publishLast` because once the http request is complete the request observable completes.
     * If you use `publish` here then the completed request observable will cause the subscribed observables to complete too.
     * We `connect` to the published observable to trigger the request immediately.
     * We could use `.refCount` here but then if the subscribers went from 1 -> 0 -> 1 then you would get
     * another request to the server.
     * We are not storing the subscription from connecting as we do not expect this service to be destroyed.
     */
    fetchNavigationInfo() {
        const navigationInfo = this.http.get(navigationPath)
            .pipe(publishLast());
        navigationInfo.connect();
        return navigationInfo;
    }
    getVersionInfo(navigationInfo) {
        const versionInfo = navigationInfo.pipe(map(response => response.__versionInfo), publishLast());
        versionInfo.connect();
        return versionInfo;
    }
    getNavigationViews(navigationInfo) {
        const navigationViews = navigationInfo.pipe(map(response => {
            const views = Object.assign({}, response);
            Object.keys(views).forEach(key => {
                if (key[0] === '_') {
                    delete views[key];
                }
            });
            return views;
        }), publishLast());
        navigationViews.connect();
        return navigationViews;
    }
    /**
     * Get an observable of the current nodes (the ones that match the current URL)
     * We use `publishReplay(1)` because otherwise subscribers will have to wait until the next
     * URL change before they receive an emission.
     * See above for discussion of using `connect`.
     */
    getCurrentNodes(navigationViews) {
        const currentNodes = combineLatest(navigationViews.pipe(map(views => this.computeUrlToNavNodesMap(views))), this.location.currentPath, (navMap, url) => {
            const urlKey = url.startsWith('api/') ? 'api' : url;
            return navMap.get(urlKey) || { '': { view: '', url: urlKey, nodes: [] } };
        })
            .pipe(publishReplay(1));
        currentNodes.connect();
        return currentNodes;
    }
    /**
     * Compute a mapping from URL to an array of nodes, where the first node in the array
     * is the one that matches the URL and the rest are the ancestors of that node.
     *
     * @param navigation - A collection of navigation nodes that are to be mapped
     */
    computeUrlToNavNodesMap(navigation) {
        const navMap = new Map();
        Object.keys(navigation)
            .forEach(view => navigation[view]
            .forEach(node => this.walkNodes(view, navMap, node)));
        return navMap;
    }
    /**
     * Add tooltip to node if it doesn't have one and have title.
     * If don't want tooltip, specify `"tooltip": ""` in navigation.json
     */
    ensureHasTooltip(node) {
        const title = node.title;
        const tooltip = node.tooltip;
        if (tooltip == null && title) {
            // add period if no trailing punctuation
            node.tooltip = title + (/[a-zA-Z0-9]$/.test(title) ? '.' : '');
        }
    }
    /**
     * Walk the nodes of a navigation tree-view,
     * patching them and computing their ancestor nodes
     */
    walkNodes(view, navMap, node, ancestors = []) {
        const nodes = [node, ...ancestors];
        const url = node.url;
        this.ensureHasTooltip(node);
        // only map to this node if it has a url
        if (url) {
            // Strip off trailing slashes from nodes in the navMap - they are not relevant to matching
            const cleanedUrl = url.replace(/\/$/, '');
            if (!navMap.has(cleanedUrl)) {
                navMap.set(cleanedUrl, {});
            }
            const navMapItem = navMap.get(cleanedUrl);
            navMapItem[view] = { url, view, nodes };
        }
        if (node.children) {
            node.children.forEach(child => this.walkNodes(view, navMap, child, nodes));
        }
    }
};
NavigationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object, LocationService])
], NavigationService);
export { NavigationService };
