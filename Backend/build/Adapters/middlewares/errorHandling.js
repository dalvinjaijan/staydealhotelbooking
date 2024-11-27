"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.customError = void 0;
class customError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.customError = customError;
class errorHandler {
    static handleError(err, req, res, next) {
        console.log("error handler", err);
        const statusCode = err instanceof customError ? err.statusCode : 500;
        res.status(statusCode).json({ error: {
                message: err.message ? err.message : ["Internal Server Error"]
            } });
    }
}
exports.errorHandler = errorHandler;
