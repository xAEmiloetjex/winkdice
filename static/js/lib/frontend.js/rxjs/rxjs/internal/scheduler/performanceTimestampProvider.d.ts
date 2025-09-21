import type { TimestampProvider } from '../types.js';
interface PerformanceTimestampProvider extends TimestampProvider {
    delegate: TimestampProvider | undefined;
}
export declare const performanceTimestampProvider: PerformanceTimestampProvider;
export {};
