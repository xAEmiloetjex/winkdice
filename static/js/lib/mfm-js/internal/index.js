import { language } from './parser.js';
import { mergeText } from './util.js';
export function fullParser(input, opts) {
    const result = language.fullParser.handler(input, 0, {
        nestLimit: (opts.nestLimit != null) ? opts.nestLimit : 20,
        depth: 0,
        linkLabel: false,
        trace: false,
    });
    return mergeText(result.value);
}
export function simpleParser(input) {
    const result = language.simpleParser.handler(input, 0, {});
    return mergeText(result.value);
}
