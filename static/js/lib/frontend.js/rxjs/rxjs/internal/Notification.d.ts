import type { PartialObserver, ObservableNotification } from './types.js';
/**
 * Executes the appropriate handler on a passed `observer` given the `kind` of notification.
 * If the handler is missing it will do nothing. Even if the notification is an error, if
 * there is no error handler on the observer, an error will not be thrown, it will noop.
 * @param notification The notification object to observe.
 * @param observer The observer to notify.
 */
export declare function observeNotification<T>(notification: ObservableNotification<T>, observer: PartialObserver<T>): void;
