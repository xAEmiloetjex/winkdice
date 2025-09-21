import { Logger } from "./logger.js";
import { RestrictiveAny } from "./types.js";

const colorHandler = {
  blue: (inp:RestrictiveAny) => <string>inp,
  yellow: (inp:RestrictiveAny) => <string>inp,
  red: (inp:RestrictiveAny) => <string>inp,
  green: (inp:RestrictiveAny) => <string>inp,
  magenta: (inp:RestrictiveAny) => <string>inp,
};

const logger = new Logger("ErrorHandler", console, colorHandler);
export class errorHandler {
  static cache = {
    unAssignable: (err: any) => errorHandler.HandleError(err),
    failed: (err: any) => errorHandler.HandleError(err),
  };
  static HandleError(err: any) {
    logger.error(err);
  }
}
