import type { TimestampProvider } from '../types.js';
interface DateTimestampProvider extends TimestampProvider {
    delegate: TimestampProvider | undefined;
}
export declare const dateTimestampProvider: DateTimestampProvider;
export {};
