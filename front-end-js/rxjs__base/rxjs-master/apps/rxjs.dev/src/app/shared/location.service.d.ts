import { Location, PlatformLocation } from '@angular/common';
import { GaService } from 'app/shared/ga.service';
import { SwUpdatesService } from 'app/sw-updates/sw-updates.service';
export declare class LocationService {
    private gaService;
    private location;
    private platformLocation;
    private readonly urlParser;
    private urlSubject;
    private swUpdateActivated;
    currentUrl: any;
    currentPath: any;
    constructor(gaService: GaService, location: Location, platformLocation: PlatformLocation, swUpdates: SwUpdatesService);
    go(url: string | null | undefined): void;
    goExternal(url: string): void;
    replace(url: string): void;
    private stripSlashes;
    search(): {
        [index: string]: string;
    };
    setSearch(label: string, params: {
        [key: string]: string | undefined;
    }): void;
    /**
     * Handle user's anchor click
     *
     * @param anchor {HTMLAnchorElement} - the anchor element clicked
     * @param button Number of the mouse button held down. 0 means left or none
     * @param ctrlKey True if control key held down
     * @param metaKey True if command or window key held down
     * @return false if service navigated with `go()`; true if browser should handle it.
     *
     * Since we are using `LocationService` to navigate between docs, without the browser
     * reloading the page, we must intercept clicks on links.
     * If the link is to a document that we will render, then we navigate using `Location.go()`
     * and tell the browser not to handle the event.
     *
     * In most apps you might do this in a `LinkDirective` attached to anchors but in this app
     * we have a special situation where the `DocViewerComponent` is displaying semi-static
     * content that cannot contain directives. So all the links in that content would not be
     * able to use such a `LinkDirective`. Instead we are adding a click handler to the
     * `AppComponent`, whose element contains all the of the application and so captures all
     * link clicks both inside and outside the `DocViewerComponent`.
     */
    handleAnchorClick(anchor: HTMLAnchorElement, button?: number, ctrlKey?: boolean, metaKey?: boolean): boolean;
}
