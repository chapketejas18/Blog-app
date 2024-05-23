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
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../repository/user/UserModel");
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield UserModel_1.userModel.findOne({ email });
        console.log("::::user", user);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = password === user.password;
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (user.role === "admin") {
            next();
        }
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});
exports.default = authorize;
