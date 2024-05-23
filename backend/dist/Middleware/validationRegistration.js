"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistrationInput = void 0;
const joi_1 = require("../config/joi");
function validateRegistrationInput(req, res, next) {
    const { error } = joi_1.userSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }
    next();
}
exports.validateRegistrationInput = validateRegistrationInput;
