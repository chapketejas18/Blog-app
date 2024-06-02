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
const BlogRepository_1 = __importDefault(require("../repository/blog/BlogRepository"));
const UserRepository_1 = __importDefault(require("../repository/user/UserRepository"));
const app_1 = __importDefault(require("firebase/compat/app"));
require("firebase/compat/storage");
class blogController {
    constructor() {
        this.getAllBlogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 2;
                const blogs = yield BlogRepository_1.default.getBlogs(page, limit);
                res.json(blogs);
            }
            catch (err) {
                const typedError = err;
                res.status(500).json({ error: typedError });
            }
        });
        this.addBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { title, description, imageurl, author } = req.body;
            try {
                const blog = yield BlogRepository_1.default.createBlog(title, description, imageurl, author);
                const blogId = blog.id;
                const updatedBlog = yield UserRepository_1.default.updateUserByBlog(author, blogId);
                if (!updatedBlog) {
                    return res.status(400).json({ message: "Error while creating data" });
                }
                res.status(200).json({ message: "Created successfully!!!" });
            }
            catch (err) {
                const typedError = err;
                res.status(500).json({ error: typedError.message });
            }
        });
        this.updateBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { title, description, imageurl } = req.body;
                const updatedBlog = yield BlogRepository_1.default.updateBlogById(id, title, description, imageurl);
                if (!updatedBlog) {
                    res.status(404).json({ message: "No Blog found for this ID" });
                    return;
                }
                res.json({ status: "Updated Successfully" });
            }
            catch (err) {
                console.error("Error:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
        this.getBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const blog = yield BlogRepository_1.default.findBlogById(id);
                if (!blog) {
                    res.status(404).json({ error: "Blog not found" });
                    return;
                }
                res.json(blog);
            }
            catch (err) {
                console.error("Error:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
        this.deleteBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const deletedBlog = yield BlogRepository_1.default.deleteBlog(id);
                if (!deletedBlog) {
                    res.status(404).json({ message: "No Blog found for this ID" });
                    return;
                }
                const imageUrl = deletedBlog.imageurl;
                if (imageUrl) {
                    const storageRef = app_1.default.storage().refFromURL(imageUrl);
                    yield storageRef.delete();
                    console.log("Image deleted from Firebase");
                }
                yield UserRepository_1.default.deleteBlogOfUser(deletedBlog);
                res.json({ status: "Deleted Successfully" });
            }
            catch (err) {
                console.error("Error:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
        this.getBlogsByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const existingUser = yield UserRepository_1.default.findUserById(id);
                if (!existingUser) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                const blogIds = existingUser.blogs;
                if (!blogIds || blogIds.length === 0) {
                    res.status(404).json({ message: "No blogs found for this user" });
                    return;
                }
                const stringIds = blogIds.map((id) => id.toString());
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 2;
                const blogs = yield BlogRepository_1.default.findBlogsByIds(stringIds, page, limit);
                res.json(blogs);
            }
            catch (err) {
                console.error("Error:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
        this.likeBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = req.params.id;
                const userid = req.body.userid;
                if (!userid) {
                    res.status(400).json({ error: "User ID is required" });
                    return;
                }
                const updatedBlog = yield BlogRepository_1.default.likeBlogById(blogId, userid);
                res.json({
                    message: "Like status updated successfully",
                    blog: updatedBlog,
                });
            }
            catch (err) {
                console.error("Error:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.default = new blogController();
