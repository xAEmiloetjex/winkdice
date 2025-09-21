import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationService } from 'app/shared/location.service';
import { CurrentNodes, NavigationViews, VersionInfo } from './navigation.model';
export { CurrentNodes, CurrentNode, NavigationNode, NavigationResponse, NavigationViews, VersionInfo } from './navigation.model';
export declare class NavigationService {
    private http;
    private location;
    /**
     * An observable collection of NavigationNode trees, which can be used to render navigational menus
     */
    navigationViews: Observable<NavigationViews>;
    /**
     * The current version of doc-app that we are running
     */
    versionInfo: Observable<VersionInfo>;
    /**
     * An observable of the current node with info about the
     * node (if any) that matches the current URL location
     * including its navigation view and its ancestor nodes in that view
     */
    currentNodes: Observable<CurrentNodes>;
    constructor(http: HttpClient, location: LocationService);
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
    private fetchNavigationInfo;
    private getVersionInfo;
    private getNavigationViews;
    /**
     * Get an observable of the current nodes (the ones that match the current URL)
     * We use `publishReplay(1)` because otherwise subscribers will have to wait until the next
     * URL change before they receive an emission.
     * See above for discussion of using `connect`.
     */
    private getCurrentNodes;
    /**
     * Compute a mapping from URL to an array of nodes, where the first node in the array
     * is the one that matches the URL and the rest are the ancestors of that node.
     *
     * @param navigation - A collection of navigation nodes that are to be mapped
     */
    private computeUrlToNavNodesMap;
    /**
     * Add tooltip to node if it doesn't have one and have title.
     * If don't want tooltip, specify `"tooltip": ""` in navigation.json
     */
    private ensureHasTooltip;
    /**
     * Walk the nodes of a navigation tree-view,
     * patching them and computing their ancestor nodes
     */
    private walkNodes;
}
