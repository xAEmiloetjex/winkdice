import { OperatorDecisionTree, OperatorTreeNode, OperatorTreeNodeWithOptions } from './interfaces';
export declare function isInitialDecision(previousBranchIds: string[]): boolean;
export declare function treeIsErrorFree(tree: OperatorDecisionTree): boolean;
export declare function nodeHasOptions(node: OperatorTreeNode): node is OperatorTreeNodeWithOptions;
