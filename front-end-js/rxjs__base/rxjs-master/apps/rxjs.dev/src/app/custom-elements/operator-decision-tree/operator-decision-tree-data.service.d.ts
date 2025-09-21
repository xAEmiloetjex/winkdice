import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperatorDecisionTree } from './interfaces';
export declare class OperatorDecisionTreeDataService {
    private http;
    constructor(http: HttpClient);
    getDecisionTree$(): Observable<OperatorDecisionTree>;
}
