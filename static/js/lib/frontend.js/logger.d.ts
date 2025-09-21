import { type RestrictiveAny } from "./types.js";
export declare enum ELoggerLevels {
    Info = 0,
    Warn = 1,
    Error = 2,
    Debug = 3,
    Http = 4
}
export declare const levels: typeof ELoggerLevels;
export declare class Logger {
    private colorHandler;
    static ANSI_ESCAPE: string;
    private output;
    log_(...args: RestrictiveAny[]): void;
    static timestamp(): {
        hours: number;
        minutes: number;
        seconds: number;
        combined: string;
    };
    prefix: string;
    constructor(prefix?: string, output?: Console, colorHandler?: {
        blue: (inp: RestrictiveAny) => string;
        yellow: (inp: RestrictiveAny) => string;
        red: (inp: RestrictiveAny) => string;
        green: (inp: RestrictiveAny) => string;
        magenta: (inp: RestrictiveAny) => string;
    });
    log(level: string | number | ELoggerLevels, ...args: RestrictiveAny[]): void;
    info(...args: RestrictiveAny[]): void;
    warn(...args: RestrictiveAny[]): void;
    error(...args: RestrictiveAny[]): void;
    debug(...args: RestrictiveAny[]): void;
    http(...args: RestrictiveAny[]): void;
    levelColor(level: ELoggerLevels): string;
    parseLevel(level: string | number | ELoggerLevels): ELoggerLevels | number;
}
