import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './resource.model';
export declare class ResourceService {
    private http;
    categories: Observable<Category[]>;
    constructor(http: HttpClient);
    private getCategories;
}
