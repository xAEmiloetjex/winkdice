import { Subject } from 'rxjs';
export class MockSearchService {
    searchResults = new Subject();
    initWorker = jasmine.createSpy('initWorker');
    loadIndex = jasmine.createSpy('loadIndex');
    search = jasmine.createSpy('search');
}
