import { addUniqueId } from './addUniqueId';
import { extractInitialSequence } from './extractInitialSequence';
import { decisionTreeReducer } from './decisionTreeReducer';
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
export function build(apiList, tree, log) {
    const nodesWithUniqueIds = addUniqueId(tree);
    const initialOption = extractInitialSequence(nodesWithUniqueIds);
    return {
        ...decisionTreeReducer(nodesWithUniqueIds, apiList, log),
        [initialOption.id]: { ...initialOption },
    };
}
