export var ErrorKind;
(function (ErrorKind) {
    ErrorKind["MissingKey"] = "MISSING_KEY";
    ErrorKind["MissingValue"] = "MISSING_VALUE";
    ErrorKind["MissingDriver"] = "MISSING_DRIVER";
    ErrorKind["ParseException"] = "PARSE_EXCEPTION";
    ErrorKind["InvalidType"] = "INVALID_TYPE";
})(ErrorKind || (ErrorKind = {}));
export class CustomError extends Error {
    message;
    kind;
    constructor(message, kind) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.message = message;
        this.kind = kind;
        this.name = kind;
    }
}
//# sourceMappingURL=error.js.map