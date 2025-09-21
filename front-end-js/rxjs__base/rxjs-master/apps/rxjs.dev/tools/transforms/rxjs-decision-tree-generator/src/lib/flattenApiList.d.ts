import { ApiListNode, FlattenedApiList } from './interfaces';
/**
 * Flattens API List from the docs generation into a map with relevant properties.
 * Makes navigation easier.
 *
 * @export
 * @param {ApiListNode[]} [apiList=[]]
 * @requires isStable
 * @returns {FlattenedApiList}
 * @todo create better type lenses - inference is not working well here
 */
export declare function flattenApiList(apiList: ApiListNode[]): FlattenedApiList;
