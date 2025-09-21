import { TreeNode, TreeNodeRaw } from './interfaces';
/**
 * Recursively walks the tree and adds unique ids.
 * It also aggregates nested nodes new unique IDs in an options field.
 * Depth is added to better determine later if it's an inital question
 *
 * @export
 * @param {Tree} tree
 * @param {number} [depth=0]
 * @requires generateUniqueId
 * @returns {Tree}
 */
export declare function addUniqueId(tree: TreeNodeRaw[], depth?: number): TreeNode[];
