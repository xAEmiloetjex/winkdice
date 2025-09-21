import { ElementRef, OnInit, QueryList } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CurrentNodes, NavigationService, NavigationNode, VersionInfo } from 'app/navigation/navigation.service';
import { DocumentService, DocumentContents } from 'app/documents/document.service';
import { Deployment } from 'app/shared/deployment.service';
import { LocationService } from 'app/shared/location.service';
import { NotificationComponent } from 'app/layout/notification/notification.component';
import { ScrollService } from 'app/shared/scroll.service';
import { SearchBoxComponent } from 'app/search/search-box/search-box.component';
import { SearchResults } from 'app/search/interfaces';
import { SearchService } from 'app/search/search.service';
import { TocService } from 'app/shared/toc.service';
import { Observable } from 'rxjs';
export declare class AppComponent implements OnInit {
    deployment: Deployment;
    private documentService;
    private hostElement;
    private locationService;
    private navigationService;
    private scrollService;
    private searchService;
    private tocService;
    private dom;
    currentDocument: DocumentContents;
    currentDocVersion: NavigationNode;
    currentNodes: CurrentNodes;
    currentPath: string;
    docVersions: NavigationNode[];
    dtOn: boolean;
    footerNodes: NavigationNode[];
    /**
     * An HTML friendly identifier for the currently displayed page.
     * This is computed from the `currentDocument.id` by replacing `/` with `-`
     */
    pageId: string;
    /**
     * An HTML friendly identifer for the "folder" of the currently displayed page.
     * This is computed by taking everything up to the first `/` in the `currentDocument.id`
     */
    folderId: string;
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
    hostClasses: string;
    isStarting: boolean;
    isTransitioning: boolean;
    isFetching: boolean;
    isSideBySide: boolean;
    private isFetchingTimeout;
    private isSideNavDoc;
    private sideBySideWidth;
    sideNavNodes: NavigationNode[];
    topMenuNodes: NavigationNode[];
    topMenuNarrowNodes: NavigationNode[];
    hasFloatingToc: boolean;
    private showFloatingToc;
    private showFloatingTocWidth;
    tocMaxHeight: string;
    private tocMaxHeightOffset;
    versionInfo: VersionInfo;
    get isOpened(): boolean;
    get mode(): "side" | "over";
    showSearchResults: boolean;
    searchResults: Observable<SearchResults>;
    searchElements: QueryList<ElementRef>;
    searchBox: SearchBoxComponent;
    sidenav: MatSidenav;
    notification: NotificationComponent;
    notificationAnimating: boolean;
    constructor(deployment: Deployment, documentService: DocumentService, hostElement: ElementRef, locationService: LocationService, navigationService: NavigationService, scrollService: ScrollService, searchService: SearchService, tocService: TocService, dom: Document);
    ngOnInit(): void;
    onDocReady(): void;
    onDocRemoved(): void;
    onDocInserted(): void;
    onDocRendered(): void;
    onDocVersionChange(versionIndex: number): void;
    onResize(width: number): void;
    onClick(eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean, altKey: boolean): boolean;
    setPageId(id: string): void;
    setFolderId(id: string): void;
    notificationDismissed(): void;
    updateHostClasses(): void;
    updateShell(): void;
    updateSideNav(): void;
    onScroll(): void;
    restrainScrolling(evt: WheelEvent): void;
    hideSearchResults(): void;
    focusSearchBox(): void;
    doSearch(query: string): void;
    onKeyUp(key: string, keyCode: number): void;
}
