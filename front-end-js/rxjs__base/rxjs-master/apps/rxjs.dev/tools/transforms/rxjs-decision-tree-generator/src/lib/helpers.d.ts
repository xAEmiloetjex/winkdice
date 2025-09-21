import { ApiListNode, TreeNodeRaw } from './interfaces';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * The model for an API list item has a stability property.
 * If the API reference is deprecated it will not be stable.
 * We don't want to point people to deprecated API references.
 *
 * @export
 * @param {string} stability
 * @returns {boolean}
 */
export declare function isStable(stability: string): boolean;
/**
 * Recursively count the number of tree nodes
 *
 * @export
 * @param {*} tree
 * @returns
 */
export declare function treeNodeCount(tree: TreeNodeRaw[]): number;
/**
 * Recursively count the number of nodes with a method
 *
 * @export
 * @param {*} tree
 * @returns
 */
export declare function rawNodesWithMethodCount(tree: TreeNodeRaw[]): number;
/**
 * Recursively count valid API references
 * Deprecated API refs are invalid
 *
 * @export
 * @param {*} apiList
 * @returns
 */
export declare function validApiRefCount(apiList: ApiListNode[]): number;
