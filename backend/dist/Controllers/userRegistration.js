"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const registerUser = (req, res) => {
    const { username, email } = req.body;
    res
        .status(200)
        .json({ message: `User ${username} registered with email ${email}` });
};
exports.registerUser = registerUser;
