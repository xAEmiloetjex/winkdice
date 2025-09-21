import { DecisionTree, FlattenedApiList, TreeNode } from './interfaces';
/**
 * Recursively walks the tree and pulls relevant information from the API list.
 * Helps build the view model.
 *
 * @export
 * @param {Tree} tree
 * @param {FlattenedApiList} apiList
 * @returns {DecisionTree}
 */
export declare function decisionTreeReducer(tree: TreeNode[], apiList: FlattenedApiList, log: {
    warn: (message: string) => void;
}): DecisionTree;
