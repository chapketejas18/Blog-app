"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = __importDefault(require("../repository/user/UserRepository"));
const checkUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { author } = req.body;
    let existingUser;
    try {
        existingUser = yield UserRepository_1.default.findUserById(author);
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
    if (!existingUser) {
        return res.status(400).json({ message: "User not found for this id" });
    }
    next();
});
exports.default = checkUserExists;
