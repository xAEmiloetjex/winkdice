import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
export declare class WebWorkerClient {
    private worker;
    private zone;
    private nextId;
    static create(worker: Worker, zone: NgZone): WebWorkerClient;
    private constructor();
    sendMessage<T>(type: string, payload?: any): Observable<T>;
}
