"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParameters = exports.validateIdParam = void 0;
const validateIdParam = (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
        res.status(400).json({ error: "Invalid ID parameter" });
    }
    else {
        next();
    }
};
exports.validateIdParam = validateIdParam;
const validateParameters = (req, res, next) => {
    const { user, mail } = req.body;
    if (!user || !mail) {
        res.status(400).json({ error: "Parameters user and mail are required." });
    }
    else {
        next();
    }
};
exports.validateParameters = validateParameters;
