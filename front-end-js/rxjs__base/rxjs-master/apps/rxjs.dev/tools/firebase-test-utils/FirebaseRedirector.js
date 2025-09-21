import { FirebaseRedirect } from './FirebaseRedirect';
export class FirebaseRedirector {
    redirects;
    constructor(redirects) {
        this.redirects = redirects.map(redirect => new FirebaseRedirect(redirect.source, redirect.destination));
    }
    redirect(url) {
        let ttl = 50;
        while (ttl > 0) {
            const newUrl = this.doRedirect(url);
            if (newUrl === url) {
                return url;
            }
            else {
                url = newUrl;
                ttl--;
            }
        }
        throw new Error('infinite redirect loop');
    }
    doRedirect(url) {
        for (const redirect of this.redirects) {
            const newUrl = redirect.replace(url);
            if (newUrl !== undefined) {
                return newUrl;
            }
        }
        return url;
    }
}
