"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const userController_1 = __importDefault(require("../Controllers/userController"));
const authMiddleware_1 = __importDefault(require("../Middleware/authMiddleware"));
const blogController_1 = __importDefault(require("../Controllers/blogController"));
const router = express.Router();
router
    .route("/mockdata")
    .get(userController_1.default.getData)
    .post(userController_1.default.createData);
router
    .route("/mockdata/:id")
    .get(userController_1.default.getDataById)
    .delete(userController_1.default.deleteDataById)
    .put(userController_1.default.updateDataById);
router.get("/errorhandler", () => {
    throw new Error("Error found here");
});
router.get("/healthcheck", (req, res) => {
    res.status(200).json({ message: "Everything is working properly" });
});
router.post("/signup", userController_1.default.register);
router.post("/login", userController_1.default.login);
router.get("/blogs", blogController_1.default.getAllBlogs);
router.post("/createblog", authMiddleware_1.default, blogController_1.default.addBlog);
router
    .route("/blogs/:id")
    .get(authMiddleware_1.default, blogController_1.default.getBlogById)
    .delete(authMiddleware_1.default, blogController_1.default.deleteBlogById)
    .put(authMiddleware_1.default, blogController_1.default.updateBlog);
router.get("/blogsof/:id", authMiddleware_1.default, blogController_1.default.getBlogsByUser);
router.put("/blogs/:id/like", blogController_1.default.likeBlog);
exports.default = router;
