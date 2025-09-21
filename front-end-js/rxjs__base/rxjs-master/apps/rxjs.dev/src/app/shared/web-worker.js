/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
import { Observable } from 'rxjs';
export class WebWorkerClient {
    worker;
    zone;
    nextId = 0;
    static create(worker, zone) {
        return new WebWorkerClient(worker, zone);
    }
    constructor(worker, zone) {
        this.worker = worker;
        this.zone = zone;
    }
    sendMessage(type, payload) {
        return new Observable((subscriber) => {
            const id = this.nextId++;
            const handleMessage = (response) => {
                const { type: responseType, id: responseId, payload: responsePayload } = response.data;
                if (type === responseType && id === responseId) {
                    this.zone.run(() => {
                        subscriber.next(responsePayload);
                        subscriber.complete();
                    });
                }
            };
            const handleError = (error) => {
                // Since we do not check type and id any error from the webworker will kill all subscribers
                this.zone.run(() => subscriber.error(error));
            };
            // Wire up the event listeners for this message
            this.worker.addEventListener('message', handleMessage);
            this.worker.addEventListener('error', handleError);
            // Post the message to the web worker
            this.worker.postMessage({ type, id, payload });
            // At completion/error unwire the event listeners
            return () => {
                this.worker.removeEventListener('message', handleMessage);
                this.worker.removeEventListener('error', handleError);
            };
        });
    }
}
