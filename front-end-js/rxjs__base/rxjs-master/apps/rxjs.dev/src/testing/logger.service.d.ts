export declare class MockLogger {
    output: {
        log: any[];
        error: any[];
        warn: any[];
    };
    log(value: any, ...rest: any[]): void;
    error(value: any, ...rest: any[]): void;
    warn(value: any, ...rest: any[]): void;
}
