import { fullParser, simpleParser } from './internal/index.js';
import { inspectOne, stringifyNode, stringifyTree } from './internal/util.js';
export function parse(input, opts = {}) {
    const nodes = fullParser(input, {
        nestLimit: opts.nestLimit,
    });
    return nodes;
}
export function parseSimple(input) {
    const nodes = simpleParser(input);
    return nodes;
}
export function toString(node) {
    if (Array.isArray(node)) {
        return stringifyTree(node);
    }
    else {
        return stringifyNode(node);
    }
}
export function inspect(node, action) {
    if (Array.isArray(node)) {
        for (const n of node) {
            inspectOne(n, action);
        }
    }
    else {
        inspectOne(node, action);
    }
}
export function extract(nodes, predicate) {
    const dest = [];
    inspect(nodes, (node) => {
        if (predicate(node)) {
            dest.push(node);
        }
    });
    return dest;
}
