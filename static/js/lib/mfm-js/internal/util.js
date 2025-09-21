import { isMfmBlock, TEXT } from '../node.js';
export function mergeText(nodes) {
    const dest = [];
    const storedChars = [];
    function generateText() {
        if (storedChars.length > 0) {
            dest.push(TEXT(storedChars.join('')));
            storedChars.length = 0;
        }
    }
    const flatten = nodes.flat(1);
    for (const node of flatten) {
        if (typeof node === 'string') {
            storedChars.push(node);
        }
        else if (!Array.isArray(node) && node.type === 'text') {
            storedChars.push(node.props.text);
        }
        else {
            generateText();
            dest.push(node);
        }
    }
    generateText();
    return dest;
}
export function stringifyNode(node) {
    var _a;
    switch (node.type) {
        case 'quote': {
            return stringifyTree(node.children).split('\n').map(line => `> ${line}`).join('\n');
        }
        case 'search': {
            return node.props.content;
        }
        case 'blockCode': {
            return `\`\`\`${(_a = node.props.lang) !== null && _a !== void 0 ? _a : ''}\n${node.props.code}\n\`\`\``;
        }
        case 'mathBlock': {
            return `\\[\n${node.props.formula}\n\\]`;
        }
        case 'center': {
            return `<center>\n${stringifyTree(node.children)}\n</center>`;
        }
        case 'emojiCode': {
            return `:${node.props.name}:`;
        }
        case 'unicodeEmoji': {
            return node.props.emoji;
        }
        case 'bold': {
            return `**${stringifyTree(node.children)}**`;
        }
        case 'small': {
            return `<small>${stringifyTree(node.children)}</small>`;
        }
        case 'italic': {
            return `<i>${stringifyTree(node.children)}</i>`;
        }
        case 'strike': {
            return `~~${stringifyTree(node.children)}~~`;
        }
        case 'inlineCode': {
            return `\`${node.props.code}\``;
        }
        case 'mathInline': {
            return `\\(${node.props.formula}\\)`;
        }
        case 'mention': {
            return node.props.acct;
        }
        case 'hashtag': {
            return `#${node.props.hashtag}`;
        }
        case 'url': {
            if (node.props.brackets) {
                return `<${node.props.url}>`;
            }
            else {
                return node.props.url;
            }
        }
        case 'link': {
            const prefix = node.props.silent ? '?' : '';
            return `${prefix}[${stringifyTree(node.children)}](${node.props.url})`;
        }
        case 'fn': {
            const argFields = Object.keys(node.props.args).map(key => {
                const value = node.props.args[key];
                if (value === true) {
                    return key;
                }
                else {
                    return `${key}=${value}`;
                }
            });
            const args = (argFields.length > 0) ? '.' + argFields.join(',') : '';
            return `$[${node.props.name}${args} ${stringifyTree(node.children)}]`;
        }
        case 'plain': {
            return `<plain>\n${stringifyTree(node.children)}\n</plain>`;
        }
        case 'text': {
            return node.props.text;
        }
    }
    throw new Error('unknown mfm node');
}
var stringifyState;
(function (stringifyState) {
    stringifyState[stringifyState["none"] = 0] = "none";
    stringifyState[stringifyState["inline"] = 1] = "inline";
    stringifyState[stringifyState["block"] = 2] = "block";
})(stringifyState || (stringifyState = {}));
export function stringifyTree(nodes) {
    const dest = [];
    let state = stringifyState.none;
    for (const node of nodes) {
        let pushLf = true;
        if (isMfmBlock(node)) {
            if (state === stringifyState.none) {
                pushLf = false;
            }
            state = stringifyState.block;
        }
        else {
            if (state === stringifyState.none || state === stringifyState.inline) {
                pushLf = false;
            }
            state = stringifyState.inline;
        }
        if (pushLf) {
            dest.push(TEXT('\n'));
        }
        dest.push(node);
    }
    return dest.map(n => stringifyNode(n)).join('');
}
export function inspectOne(node, action) {
    action(node);
    if (node.children != null) {
        for (const child of node.children) {
            inspectOne(child, action);
        }
    }
}
