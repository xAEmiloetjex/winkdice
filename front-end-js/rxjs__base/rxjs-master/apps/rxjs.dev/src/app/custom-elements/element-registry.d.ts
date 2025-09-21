import { Type } from '@angular/core';
export declare const ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES: {
    selector: string;
    loadChildren: () => Promise<typeof import("./announcement-bar/announcement-bar.module").AnnouncementBarModule>;
}[];
/**
 * Interface expected to be implemented by all modules that declare a component that can be used as
 * a custom element.
 */
export interface WithCustomElementComponent {
    customElementComponent: Type<any>;
}
/** Injection token to provide the element path modules. */
/** Map of possible custom element selectors to their lazy-loadable module paths. */
/** Injection token to provide the element path modules. */
export declare const ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN: any;
/** Map of possible custom element selectors to their lazy-loadable module paths. */
export declare const ELEMENT_MODULE_LOAD_CALLBACKS: Map<string, LoadChildrenCallback>;
