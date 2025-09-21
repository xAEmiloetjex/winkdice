// Utilities for processing HTML element attributes
import { ElementRef } from '@angular/core';
/**
 * Get attribute map from element or ElementRef `attributes`.
 * Attribute map keys are forced lowercase for case-insensitive lookup.
 *
 * @param el The source of the attributes.
 */
export function getAttrs(el) {
    const attrs = el instanceof ElementRef ? el.nativeElement.attributes : el.attributes;
    const attrMap = {};
    for (const attr of attrs /* cast due to https://github.com/Microsoft/TypeScript/issues/2695 */) {
        attrMap[attr.name.toLowerCase()] = attr.value;
    }
    return attrMap;
}
/**
 * Return the attribute that matches `attr`.
 *
 * @param attr Name of the attribute or a string of candidate attribute names.
 */
export function getAttrValue(attrs, attr) {
    const key = (typeof attr === 'string')
        ? attr
        : attr.find(a => attrs.hasOwnProperty(a.toLowerCase()));
    return (key === undefined) ? undefined : attrs[key.toLowerCase()];
}
/**
 * Return the boolean state of an attribute value (if supplied)
 *
 * @param attrValue The string value of some attribute (or undefined if attribute not present).
 * @param def Default boolean value when attribute is undefined.
 */
export function boolFromValue(attrValue, def = false) {
    return attrValue === undefined ? def : attrValue.trim() !== 'false';
}
/**
 * Return the boolean state of attribute from an element
 *
 * @param el The source of the attributes.
 * @param atty Name of the attribute or a string of candidate attribute names.
 * @param def Default boolean value when attribute is undefined.
 */
export function getBoolFromAttribute(el, attr, def = false) {
    return boolFromValue(getAttrValue(getAttrs(el), attr), def);
}
