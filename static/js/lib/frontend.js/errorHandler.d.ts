export declare class errorHandler {
    static cache: {
        unAssignable: (err: any) => void;
        failed: (err: any) => void;
    };
    static HandleError(err: any): void;
}
