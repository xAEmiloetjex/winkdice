import * as XRegExp from 'xregexp';
export declare class FirebaseGlob {
    pattern: string;
    regex: XRegExp;
    namedParams: {
        [key: string]: boolean;
    };
    restParams: {
        [key: string]: boolean;
    };
    constructor(glob: string);
    test(url: string): any;
    match(url: string): {};
}
