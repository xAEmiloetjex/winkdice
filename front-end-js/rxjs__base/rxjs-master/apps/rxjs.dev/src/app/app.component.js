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
var _a, _b, _c;
import { Component, ElementRef, HostBinding, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationService } from 'app/navigation/navigation.service';
import { DocumentService } from 'app/documents/document.service';
import { Deployment } from 'app/shared/deployment.service';
import { LocationService } from 'app/shared/location.service';
import { NotificationComponent } from 'app/layout/notification/notification.component';
import { ScrollService } from 'app/shared/scroll.service';
import { SearchBoxComponent } from 'app/search/search-box/search-box.component';
import { SearchService } from 'app/search/search.service';
import { TocService } from 'app/shared/toc.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
const sideNavView = 'SideNav';
let AppComponent = class AppComponent {
    deployment;
    documentService;
    hostElement;
    locationService;
    navigationService;
    scrollService;
    searchService;
    tocService;
    dom;
    currentDocument;
    currentDocVersion;
    currentNodes = {};
    currentPath;
    docVersions;
    dtOn = false;
    footerNodes;
    /**
     * An HTML friendly identifier for the currently displayed page.
     * This is computed from the `currentDocument.id` by replacing `/` with `-`
     */
    pageId;
    /**
     * An HTML friendly identifer for the "folder" of the currently displayed page.
     * This is computed by taking everything up to the first `/` in the `currentDocument.id`
     */
    folderId;
    /**
     * These CSS classes are computed from the current state of the application
     * (e.g. what document is being viewed) to allow for fine grain control over
     * the styling of individual pages.
     * You will get three classes:
     *
     * * `page-...`: computed from the current document id (e.g. events, guide-security, tutorial-toh-pt2)
     * * `folder-...`: computed from the top level folder for an id (e.g. guide, tutorial, etc)
     * * `view-...`: computed from the navigation view (e.g. SideNav, TopBar, etc)
     */
    hostClasses = '';
    // Disable all Angular animations for the initial render.
    isStarting = true;
    isTransitioning = true;
    isFetching = false;
    isSideBySide = false;
    isFetchingTimeout;
    isSideNavDoc = false;
    sideBySideWidth = 992;
    sideNavNodes;
    topMenuNodes;
    topMenuNarrowNodes;
    hasFloatingToc = false;
    showFloatingToc = new BehaviorSubject(false);
    showFloatingTocWidth = 800;
    tocMaxHeight;
    tocMaxHeightOffset = 0;
    versionInfo;
    get isOpened() {
        return this.isSideBySide && this.isSideNavDoc;
    }
    get mode() {
        return this.isSideBySide ? 'side' : 'over';
    }
    // Search related properties
    showSearchResults = false;
    searchResults;
    searchElements;
    searchBox;
    sidenav;
    notification;
    notificationAnimating = false;
    constructor(deployment, documentService, hostElement, locationService, navigationService, scrollService, searchService, tocService, dom) {
        this.deployment = deployment;
        this.documentService = documentService;
        this.hostElement = hostElement;
        this.locationService = locationService;
        this.navigationService = navigationService;
        this.scrollService = scrollService;
        this.searchService = searchService;
        this.tocService = tocService;
        this.dom = dom;
    }
    ngOnInit() {
        // Do not initialize the search on browsers that lack web worker support
        if ('Worker' in window) {
            // Delay initialization by up to 2 seconds
            this.searchService.initWorker(2000);
        }
        this.onResize(window.innerWidth);
        /* No need to unsubscribe because this root component never dies */
        this.documentService.currentDocument.subscribe((doc) => (this.currentDocument = doc));
        this.locationService.currentPath.subscribe((path) => {
            if (path === this.currentPath) {
                // scroll only if on same page (most likely a change to the hash)
                this.scrollService.scroll();
            }
            else {
                // don't scroll; leave that to `onDocRendered`
                this.currentPath = path;
                // Start progress bar if doc not rendered within brief time
                clearTimeout(this.isFetchingTimeout);
                this.isFetchingTimeout = setTimeout(() => (this.isFetching = true), 200);
            }
        });
        this.navigationService.currentNodes.subscribe((currentNodes) => {
            this.currentNodes = currentNodes;
        });
        // Compute the version picker list from the current version and the versions in the navigation map
        combineLatest(this.navigationService.versionInfo, this.navigationService.navigationViews.pipe(map((views) => views.docVersions))).subscribe(([versionInfo, versions]) => {
            this.docVersions = [...versions];
            // Find the current version - either title matches the current deployment mode
            // or its title matches the major version of the current version info
            this.currentDocVersion = this.docVersions.find((version) => version.title === this.deployment.mode || version.title === `v${versionInfo.major}`);
            this.currentDocVersion.title += ` (v${versionInfo.raw})`;
        });
        this.navigationService.navigationViews.subscribe((views) => {
            this.footerNodes = views.Footer || [];
            this.sideNavNodes = views.SideNav || [];
            this.topMenuNodes = views.TopBar || [];
            this.topMenuNarrowNodes = views.TopBarNarrow || this.topMenuNodes;
        });
        this.navigationService.versionInfo.subscribe((vi) => (this.versionInfo = vi));
        const hasNonEmptyToc = this.tocService.tocList.pipe(map((tocList) => tocList.length > 0));
        combineLatest(hasNonEmptyToc, this.showFloatingToc).subscribe(([hasToc, showFloatingToc]) => (this.hasFloatingToc = hasToc && showFloatingToc));
        // Generally, we want to delay updating the shell (e.g. host classes, sidenav state) for the new
        // document, until after the leaving document has been removed (to avoid having the styles for
        // the new document applied prematurely).
        // For the first document, though, (when we know there is no previous document), we want to
        // ensure the styles are applied as soon as possible to avoid flicker.
        combineLatest(this.documentService.currentDocument, // ...needed to determine host classes
        this.navigationService.currentNodes) // ...needed to determine `sidenav` state
            .pipe(first())
            .subscribe(() => this.updateShell());
    }
    onDocReady() {
        // About to transition to new view.
        this.isTransitioning = true;
        // Stop fetching timeout (which, when render is fast, means progress bar never shown)
        clearTimeout(this.isFetchingTimeout);
        // If progress bar has been shown, keep it for at least 500ms (to avoid flashing).
        setTimeout(() => (this.isFetching = false), 500);
    }
    onDocRemoved() {
        this.scrollService.removeStoredScrollPosition();
    }
    onDocInserted() {
        // Update the shell (host classes, sidenav state) to match the new document.
        // This may be called as a result of actions initiated by view updates.
        // In order to avoid errors (e.g. `ExpressionChangedAfterItHasBeenChecked`), updating the view
        // (e.g. sidenav, host classes) needs to happen asynchronously.
        setTimeout(() => this.updateShell());
        // Scroll the good position depending on the context
        this.scrollService.scrollAfterRender(500);
    }
    onDocRendered() {
        if (this.isStarting) {
            // In order to ensure that the initial sidenav-content left margin
            // adjustment happens without animation, we need to ensure that
            // `isStarting` remains `true` until the margin change is triggered.
            // (Apparently, this happens with a slight delay.)
            setTimeout(() => (this.isStarting = false), 100);
        }
        const head = this.dom.getElementsByTagName('head')[0];
        let element = this.dom.querySelector('link[rel=\'canonical\']') || null;
        if (element === null) {
            element = this.dom.createElement('link');
            head.appendChild(element);
        }
        element.setAttribute('rel', 'canonical');
        element.setAttribute('href', `https://rxjs.dev/${this.currentPath}`);
        this.isTransitioning = false;
    }
    onDocVersionChange(versionIndex) {
        const version = this.docVersions[versionIndex];
        if (version.url) {
            this.locationService.go(version.url);
        }
    }
    onResize(width) {
        this.isSideBySide = width >= this.sideBySideWidth;
        this.showFloatingToc.next(width > this.showFloatingTocWidth);
        if (this.isSideBySide && !this.isSideNavDoc) {
            // If this is a non-sidenav doc and the screen is wide enough so that we can display menu
            // items in the top-bar, ensure the sidenav is closed.
            // (This condition can only be met when the resize event changes the value of `isSideBySide`
            //  from `false` to `true` while on a non-sidenav doc.)
            this.sidenav.toggle(false);
        }
    }
    onClick(eventTarget, button, ctrlKey, metaKey, altKey) {
        // Hide the search results if we clicked outside both the "search box" and the "search results"
        if (!this.searchElements.some((element) => element.nativeElement.contains(eventTarget))) {
            this.hideSearchResults();
        }
        // Show developer source view if the footer is clicked while holding the meta and alt keys
        if (eventTarget.tagName === 'FOOTER' && metaKey && altKey) {
            this.dtOn = !this.dtOn;
            return false;
        }
        // Deal with anchor clicks; climb DOM tree until anchor found (or null)
        let target = eventTarget;
        while (target && !(target instanceof HTMLAnchorElement)) {
            target = target.parentElement;
        }
        if (target instanceof HTMLAnchorElement) {
            return this.locationService.handleAnchorClick(target, button, ctrlKey, metaKey);
        }
        // Allow the click to pass through
        return true;
    }
    setPageId(id) {
        // Special case the home page
        this.pageId = id === 'index' ? 'home' : id.replace('/', '-');
    }
    setFolderId(id) {
        // Special case the home page
        this.folderId = id === 'index' ? 'home' : id.split('/', 1)[0];
    }
    notificationDismissed() {
        this.notificationAnimating = true;
        // this should be kept in sync with the animation durations in:
        // - aio/src/styles/2-modules/_notification.scss
        // - aio/src/app/layout/notification/notification.component.ts
        setTimeout(() => (this.notificationAnimating = false), 250);
        this.updateHostClasses();
    }
    updateHostClasses() {
        const mode = `mode-${this.deployment.mode}`;
        const sideNavOpen = `sidenav-${this.sidenav.opened ? 'open' : 'closed'}`;
        const pageClass = `page-${this.pageId}`;
        const folderClass = `folder-${this.folderId}`;
        const viewClasses = Object.keys(this.currentNodes)
            .map((view) => `view-${view}`)
            .join(' ');
        const notificationClass = `aio-notification-${this.notification.showNotification}`;
        const notificationAnimatingClass = this.notificationAnimating ? 'aio-notification-animating' : '';
        this.hostClasses = [mode, sideNavOpen, pageClass, folderClass, viewClasses, notificationClass, notificationAnimatingClass].join(' ');
    }
    updateShell() {
        // Update the SideNav state (if necessary).
        this.updateSideNav();
        // Update the host classes.
        this.setPageId(this.currentDocument.id);
        this.setFolderId(this.currentDocument.id);
        this.updateHostClasses();
    }
    updateSideNav() {
        // Preserve current sidenav open state by default.
        let openSideNav = this.sidenav.opened;
        const isSideNavDoc = !!this.currentNodes[sideNavView];
        if (this.isSideNavDoc !== isSideNavDoc) {
            // View type changed. Is it now a sidenav view (e.g, guide or tutorial)?
            // Open if changed to a sidenav doc; close if changed to a marketing doc.
            openSideNav = this.isSideNavDoc = isSideNavDoc;
        }
        // May be open or closed when wide; always closed when narrow.
        this.sidenav.toggle(this.isSideBySide && openSideNav);
    }
    // Dynamically change height of table of contents container
    onScroll() {
        if (!this.tocMaxHeightOffset) {
            // Must wait until `mat-toolbar` is measurable.
            const el = this.hostElement.nativeElement;
            const headerEl = el.querySelector('.app-toolbar');
            const footerEl = el.querySelector('footer');
            if (headerEl && footerEl) {
                this.tocMaxHeightOffset = headerEl.clientHeight + footerEl.clientHeight + 24; //  fudge margin
            }
        }
        this.tocMaxHeight = (document.body.scrollHeight - window.pageYOffset - this.tocMaxHeightOffset).toFixed(2);
    }
    // Restrain scrolling inside an element, when the cursor is over it
    restrainScrolling(evt) {
        const elem = evt.currentTarget;
        const scrollTop = elem.scrollTop;
        if (evt.deltaY < 0) {
            // Trying to scroll up: Prevent scrolling if already at the top.
            if (scrollTop < 1) {
                evt.preventDefault();
            }
        }
        else {
            // Trying to scroll down: Prevent scrolling if already at the bottom.
            const maxScrollTop = elem.scrollHeight - elem.clientHeight;
            if (maxScrollTop - scrollTop < 1) {
                evt.preventDefault();
            }
        }
    }
    // Search related methods and handlers
    hideSearchResults() {
        this.showSearchResults = false;
        const oldSearch = this.locationService.search();
        if (oldSearch.search !== undefined) {
            this.locationService.setSearch('', { ...oldSearch, search: undefined });
        }
    }
    focusSearchBox() {
        if (this.searchBox) {
            this.searchBox.focus();
        }
    }
    doSearch(query) {
        this.searchResults = this.searchService.search(query);
        this.showSearchResults = !!query;
    }
    onKeyUp(key, keyCode) {
        // forward slash "/"
        if (key === '/' || keyCode === 191) {
            this.focusSearchBox();
        }
        if (key === 'Escape' || keyCode === 27) {
            // escape key
            if (this.showSearchResults) {
                this.hideSearchResults();
                this.focusSearchBox();
            }
        }
    }
};
__decorate([
    HostBinding('class'),
    __metadata("design:type", Object)
], AppComponent.prototype, "hostClasses", void 0);
__decorate([
    HostBinding('@.disabled'),
    __metadata("design:type", Object)
], AppComponent.prototype, "isStarting", void 0);
__decorate([
    ViewChildren('searchBox, searchResultsView', { read: ElementRef }),
    __metadata("design:type", typeof (_b = typeof QueryList !== "undefined" && QueryList) === "function" ? _b : Object)
], AppComponent.prototype, "searchElements", void 0);
__decorate([
    ViewChild(SearchBoxComponent, { static: true }),
    __metadata("design:type", SearchBoxComponent)
], AppComponent.prototype, "searchBox", void 0);
__decorate([
    ViewChild(MatSidenav, { static: true }),
    __metadata("design:type", typeof (_c = typeof MatSidenav !== "undefined" && MatSidenav) === "function" ? _c : Object)
], AppComponent.prototype, "sidenav", void 0);
__decorate([
    ViewChild(NotificationComponent, { static: true }),
    __metadata("design:type", NotificationComponent)
], AppComponent.prototype, "notification", void 0);
__decorate([
    HostListener('window:resize', ['$event.target.innerWidth']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "onResize", null);
__decorate([
    HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey', '$event.altKey']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HTMLElement, Number, Boolean, Boolean, Boolean]),
    __metadata("design:returntype", Boolean)
], AppComponent.prototype, "onClick", null);
__decorate([
    HostListener('window:scroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "onScroll", null);
__decorate([
    HostListener('document:keyup', ['$event.key', '$event.which']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "onKeyUp", null);
AppComponent = __decorate([
    Component({
        selector: 'aio-shell',
        template: `<div id="top-of-page"></div>

    <div *ngIf="isFetching" class="progress-bar-container">
      <mat-progress-bar mode="indeterminate" color="warn"></mat-progress-bar>
    </div>

    <mat-toolbar color="primary" class="app-toolbar no-print" [class.transitioning]="isTransitioning">
      <mat-toolbar-row class="notification-container">
        <aio-notification
          notificationId="blm-2020"
          expirationDate="2022-04-15"
          [dismissOnContentClick]="false"
          (dismissed)="notificationDismissed()"
        >
          <a href="/blackLivesMatter">#BlackLivesMatter</a>
        </aio-notification>
      </mat-toolbar-row>
      <mat-toolbar-row>
        <button mat-button class="hamburger" [class.starting]="isStarting" (click)="sidenav.toggle()" title="Docs menu">
          <mat-icon svgIcon="menu"></mat-icon>
        </button>
        <a class="nav-link home" href="/" [ngSwitch]="isSideBySide">
          <img *ngSwitchCase="true" src="assets/images/logos/logo.png" width="150" height="40" title="Home" alt="Home" />
          <img *ngSwitchDefault src="assets/images/logos/Rx_Logo_S.png" width="37" height="40" title="Home" alt="Home" />
        </a>
        <aio-top-menu *ngIf="isSideBySide" [nodes]="topMenuNodes"></aio-top-menu>
        <aio-search-box class="search-container" #searchBox (onSearch)="doSearch($event)" (onFocus)="doSearch($event)"></aio-search-box>
        <div class="toolbar-external-icons-container">
          <a href="https://github.com/ReactiveX/rxjs" title="GitHub" target="_blank">
            <img src="assets/images/logos/github-icon.svg" alt="View on GitHub"
          /></a>
        </div>
      </mat-toolbar-row>
    </mat-toolbar>

    <aio-search-results
      #searchResultsView
      *ngIf="showSearchResults"
      [searchResults]="searchResults | async"
      (resultSelected)="hideSearchResults()"
    ></aio-search-results>

    <mat-sidenav-container class="sidenav-container" [class.starting]="isStarting" [class.has-floating-toc]="hasFloatingToc">
      <mat-sidenav
        [ngClass]="{ collapsed: !isSideBySide }"
        #sidenav
        class="sidenav"
        [mode]="mode"
        [opened]="isOpened"
        (openedChange)="updateHostClasses()"
      >
        <aio-nav-menu
          *ngIf="!isSideBySide"
          [nodes]="topMenuNarrowNodes"
          [currentNode]="currentNodes?.TopBarNarrow"
          [isWide]="false"
        ></aio-nav-menu>
        <aio-nav-menu [nodes]="sideNavNodes" [currentNode]="currentNodes?.SideNav" [isWide]="isSideBySide"></aio-nav-menu>

        <div class="doc-version">
          <aio-select (change)="onDocVersionChange($event.index)" [options]="docVersions" [selected]="currentDocVersion"></aio-select>
        </div>
      </mat-sidenav>

      <section class="sidenav-content" [id]="pageId" role="main">
        <aio-mode-banner [mode]="deployment.mode" [version]="versionInfo"></aio-mode-banner>
        <aio-doc-viewer
          [class.no-animations]="isStarting"
          [doc]="currentDocument"
          (docReady)="onDocReady()"
          (docRemoved)="onDocRemoved()"
          (docInserted)="onDocInserted()"
          (docRendered)="onDocRendered()"
        >
        </aio-doc-viewer>
        <aio-dt *ngIf="dtOn" [(doc)]="currentDocument"></aio-dt>
      </section>
    </mat-sidenav-container>

    <div *ngIf="hasFloatingToc" class="toc-container no-print" [style.max-height.px]="tocMaxHeight" (wheel)="restrainScrolling($event)">
      <aio-lazy-ce selector="aio-toc"></aio-lazy-ce>
    </div>

    <footer class="no-print">
      <aio-footer [nodes]="footerNodes" [versionInfo]="versionInfo"></aio-footer>
    </footer> `,
    }),
    __param(8, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Deployment,
        DocumentService, typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, LocationService,
        NavigationService,
        ScrollService,
        SearchService,
        TocService,
        Document])
], AppComponent);
export { AppComponent };
