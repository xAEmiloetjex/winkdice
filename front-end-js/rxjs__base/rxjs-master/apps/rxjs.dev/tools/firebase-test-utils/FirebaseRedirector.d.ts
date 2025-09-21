export interface FirebaseRedirectConfig {
    source: string;
    destination: string;
}
export declare class FirebaseRedirector {
    private redirects;
    constructor(redirects: FirebaseRedirectConfig[]);
    redirect(url: string): string;
    private doRedirect;
}
