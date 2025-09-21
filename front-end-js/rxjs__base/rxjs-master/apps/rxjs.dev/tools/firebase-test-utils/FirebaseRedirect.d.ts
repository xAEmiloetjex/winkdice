import { FirebaseGlob } from './FirebaseGlob';
export declare class FirebaseRedirect {
    source: string;
    destination: string;
    glob: FirebaseGlob;
    constructor(source: string, destination: string);
    replace(url: string): any;
}
