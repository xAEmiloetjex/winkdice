export declare class GaService {
    private window;
    private previousUrl;
    constructor(window: Window);
    locationChanged(url: string): void;
    sendPage(url: string): void;
    sendEvent(source: string, action: string, label?: string, value?: number): void;
    ga(...args: any[]): void;
}
