import { FlattenedApiList, DecisionTree, TreeNodeRaw } from './interfaces';
/**
 * Main build script, outputs the decision tree.
 *
 * @export
 * @param {FlattenedApiList} apiList
 * @param {Tree} tree
 * @requires addUniqueId
 * @requires extractInitialSequence
 * @requires decisionTreeReducer
 * @returns {DecisionTree}
 */
export declare function build(apiList: FlattenedApiList, tree: TreeNodeRaw[], log: {
    warn: (message: string) => void;
}): DecisionTree;
