import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
export class MockLocationService {
    initialUrl;
    urlSubject = new BehaviorSubject(this.initialUrl);
    currentUrl = this.urlSubject.asObservable().pipe(map(url => this.stripSlashes(url)));
    // strip off query and hash
    currentPath = this.currentUrl.pipe(map(url => url.match(/[^?#]*/)[0]));
    search = jasmine.createSpy('search').and.returnValue({});
    setSearch = jasmine.createSpy('setSearch');
    go = jasmine.createSpy('Location.go').and
        .callFake((url) => this.urlSubject.next(url));
    goExternal = jasmine.createSpy('Location.goExternal');
    replace = jasmine.createSpy('Location.replace');
    handleAnchorClick = jasmine.createSpy('Location.handleAnchorClick')
        .and.returnValue(false); // prevent click from causing a browser navigation
    constructor(initialUrl) {
        this.initialUrl = initialUrl;
    }
    stripSlashes(url) {
        return url.replace(/^\/+/, '').replace(/\/+(\?|#|$)/, '$1');
    }
}
