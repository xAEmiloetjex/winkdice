/**
 * Strip out initial sequence and add to tree
 *
 * @export
 * @param {Tree} tree
 * @returns {{id: string, options: string[]}}
 */
export function extractInitialSequence(tree) {
    return {
        id: 'initial',
        options: tree.filter(node => !node.depth).map(node => node.id)
    };
}
