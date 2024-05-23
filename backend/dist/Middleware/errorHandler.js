"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || "Internal Server Error";
    if (!err.statusCode && !err.message) {
        statusCode = 500;
        errorMessage = "Internal Server Error";
    }
    res.status(statusCode).json({ error: errorMessage });
};
exports.default = errorHandler;
