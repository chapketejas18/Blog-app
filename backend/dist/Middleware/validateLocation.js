"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateLocationCode = (req, res, next) => {
    const { countrycode } = req.query;
    if (countrycode && countrycode.toUpperCase() === "IN") {
        next();
    }
    else {
        res
            .status(403)
            .json({ error: "Access denied. Request from an unexpected region." });
    }
};
exports.default = validateLocationCode;
