/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * This is the module description
 */
export * from './importedSrc';
/**
 * This is some random other comment
 */
/**
 * This is MyClass
 */
export declare class MyClass {
    message: String;
    /**
     * Create a new MyClass
     * @param {String} name The name to say hello to
     */
    constructor(name: any);
    /**
     * Return a greeting message
     */
    greet(): String;
}
/**
 * An exported function
 */
export declare const myFn: (val: number) => number;
