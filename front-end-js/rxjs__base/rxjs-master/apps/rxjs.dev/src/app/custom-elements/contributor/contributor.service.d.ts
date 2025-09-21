import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContributorGroup } from './contributors.model';
export declare class ContributorService {
    private http;
    contributors: Observable<ContributorGroup[]>;
    constructor(http: HttpClient);
    private getContributors;
}
