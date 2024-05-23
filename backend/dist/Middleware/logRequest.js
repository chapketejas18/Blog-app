"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};
exports.default = logRequest;
