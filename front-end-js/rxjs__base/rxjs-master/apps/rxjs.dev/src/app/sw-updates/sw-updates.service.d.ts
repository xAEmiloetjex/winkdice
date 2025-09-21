import { ApplicationRef, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { Logger } from 'app/shared/logger.service';
/**
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 6 hours.
 * 3. Whenever an update is available, it activates the update.
 *
 * @property
 * `updateActivated` {Observable<string>} - Emit the version hash whenever an update is activated.
 */
export declare class SwUpdatesService implements OnDestroy {
    private logger;
    private swu;
    private checkInterval;
    private onDestroy;
    updateActivated: Observable<string>;
    constructor(appRef: ApplicationRef, logger: Logger, swu: SwUpdate);
    ngOnDestroy(): void;
    private log;
}
