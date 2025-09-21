import type { Observable } from '@rxjs/observable';
export interface FirstValueFromConfig<T> {
    defaultValue: T;
}
export declare function firstValueFrom<T, D>(source: Observable<T>, config: FirstValueFromConfig<D>): Promise<T | D>;
export declare function firstValueFrom<T>(source: Observable<T>): Promise<T>;
