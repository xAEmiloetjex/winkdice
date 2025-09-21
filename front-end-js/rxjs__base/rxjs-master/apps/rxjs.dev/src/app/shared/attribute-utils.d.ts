import { ElementRef } from '@angular/core';
export interface AttrMap {
    [key: string]: string;
}
/**
 * Get attribute map from element or ElementRef `attributes`.
 * Attribute map keys are forced lowercase for case-insensitive lookup.
 *
 * @param el The source of the attributes.
 */
export declare function getAttrs(el: HTMLElement | ElementRef): AttrMap;
/**
 * Return the attribute that matches `attr`.
 *
 * @param attr Name of the attribute or a string of candidate attribute names.
 */
export declare function getAttrValue(attrs: AttrMap, attr: string | string[]): string | undefined;
/**
 * Return the boolean state of an attribute value (if supplied)
 *
 * @param attrValue The string value of some attribute (or undefined if attribute not present).
 * @param def Default boolean value when attribute is undefined.
 */
export declare function boolFromValue(attrValue: string | undefined, def?: boolean): boolean;
/**
 * Return the boolean state of attribute from an element
 *
 * @param el The source of the attributes.
 * @param atty Name of the attribute or a string of candidate attribute names.
 * @param def Default boolean value when attribute is undefined.
 */
export declare function getBoolFromAttribute(el: HTMLElement | ElementRef, attr: string | string[], def?: boolean): boolean;
