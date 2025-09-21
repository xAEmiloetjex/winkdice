import { Logger } from "./logger.js";
const colorHandler = {
    blue: (inp) => inp,
    yellow: (inp) => inp,
    red: (inp) => inp,
    green: (inp) => inp,
    magenta: (inp) => inp,
};
const logger = new Logger("ErrorHandler", console, colorHandler);
export class errorHandler {
    static cache = {
        unAssignable: (err) => errorHandler.HandleError(err),
        failed: (err) => errorHandler.HandleError(err),
    };
    static HandleError(err) {
        logger.error(err);
    }
}
