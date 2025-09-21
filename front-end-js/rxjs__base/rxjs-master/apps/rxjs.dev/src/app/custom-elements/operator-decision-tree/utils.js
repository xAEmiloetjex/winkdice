export function isInitialDecision(previousBranchIds) {
    return (previousBranchIds.includes('initial') && previousBranchIds.length === 1);
}
export function treeIsErrorFree(tree) {
    return !tree.error;
}
export function nodeHasOptions(node) {
    return !!node.options;
}
