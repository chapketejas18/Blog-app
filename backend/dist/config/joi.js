"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    username: joi_1.default.string(),
    email: joi_1.default.string().email(),
    password: joi_1.default.string().pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&#])[a-zA-Z0-9@$!%*?&#]{7,30}$/),
});
exports.blogSchema = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
});
