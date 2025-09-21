const blockTypes = ['quote', 'search', 'blockCode', 'mathBlock', 'center'];
export function isMfmBlock(node) {
    return blockTypes.includes(node.type);
}
export const QUOTE = (children) => { return { type: 'quote', children }; };
export const SEARCH = (query, content) => { return { type: 'search', props: { query, content } }; };
export const CODE_BLOCK = (code, lang) => { return { type: 'blockCode', props: { code, lang } }; };
export const MATH_BLOCK = (formula) => { return { type: 'mathBlock', props: { formula } }; };
export const CENTER = (children) => { return { type: 'center', children }; };
export const UNI_EMOJI = (value) => { return { type: 'unicodeEmoji', props: { emoji: value } }; };
export const EMOJI_CODE = (name) => { return { type: 'emojiCode', props: { name: name } }; };
export const BOLD = (children) => { return { type: 'bold', children }; };
export const SMALL = (children) => { return { type: 'small', children }; };
export const ITALIC = (children) => { return { type: 'italic', children }; };
export const STRIKE = (children) => { return { type: 'strike', children }; };
export const INLINE_CODE = (code) => { return { type: 'inlineCode', props: { code } }; };
export const MATH_INLINE = (formula) => { return { type: 'mathInline', props: { formula } }; };
export const MENTION = (username, host, acct) => { return { type: 'mention', props: { username, host, acct } }; };
export const HASHTAG = (value) => { return { type: 'hashtag', props: { hashtag: value } }; };
export const N_URL = (value, brackets) => {
    const node = { type: 'url', props: { url: value } };
    if (brackets)
        node.props.brackets = brackets;
    return node;
};
export const LINK = (silent, url, children) => { return { type: 'link', props: { silent, url }, children }; };
export const FN = (name, args, children) => { return { type: 'fn', props: { name, args }, children }; };
export const PLAIN = (text) => { return { type: 'plain', children: [TEXT(text)] }; };
export const TEXT = (value) => { return { type: 'text', props: { text: value } }; };
