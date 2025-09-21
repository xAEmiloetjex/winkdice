interface StackBlitzExampleConfig {
    code: string;
    language: string;
    html?: string;
    dependencies: {
        [name: string]: string;
    };
}
export declare class StackblitzService {
    openProject(config: StackBlitzExampleConfig): void;
}
export {};
