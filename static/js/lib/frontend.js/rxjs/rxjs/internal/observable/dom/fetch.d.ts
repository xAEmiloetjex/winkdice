import { Observable } from '../../../../observable/observable.js';
import type { ObservableInput } from '../../types.js';
export declare function fromFetch<T>(input: string | Request, init: RequestInit & {
    selector: (response: Response) => ObservableInput<T>;
}): Observable<T>;
export declare function fromFetch(input: string | Request, init?: RequestInit): Observable<Response>;
