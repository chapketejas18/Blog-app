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
const app_1 = __importDefault(require("../../app"));
const UserModel_1 = require("../user/UserModel");
const BlogModel_1 = require("./BlogModel");
class BlogRepository {
    constructor() {
        this.getBlogs = (page, limit) => __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            return BlogModel_1.blogModel.find().sort({ createdOn: -1 }).skip(skip).limit(limit);
        });
        this.createBlog = (title, description, imageurl, author) => __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.userModel.findById(author);
            if (!user) {
                throw new Error("User not found");
            }
            const blog = {
                title,
                description,
                imageurl,
                author: user.username,
                authorid: author,
            };
            const createdBlog = yield BlogModel_1.blogModel.create(blog);
            app_1.default.emit("blogCreated", createdBlog);
            return createdBlog;
        });
        this.updateBlogById = (id, title, description, imageurl) => __awaiter(this, void 0, void 0, function* () {
            const blog = {
                title,
                description,
                imageurl,
            };
            const updatedBlog = yield BlogModel_1.blogModel.findByIdAndUpdate(id, blog, {
                new: true,
            });
            app_1.default.emit("blogUpdated", updatedBlog);
            return updatedBlog;
        });
        this.findBlogById = (id) => __awaiter(this, void 0, void 0, function* () {
            return BlogModel_1.blogModel.findById(id);
        });
        this.deleteBlog = (id) => __awaiter(this, void 0, void 0, function* () {
            const deletedBlog = yield BlogModel_1.blogModel.findByIdAndDelete(id);
            app_1.default.emit("blogDeleted", id);
            return deletedBlog;
        });
        this.findBlogsByIds = (ids, page, limit) => __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            return BlogModel_1.blogModel
                .find({ _id: { $in: ids } })
                .sort({ createdOn: -1 })
                .skip(skip)
                .limit(limit);
        });
        this.likeBlogById = (id, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield BlogModel_1.blogModel.findById(id);
                if (!blog) {
                    throw new Error("Blog not found");
                }
                const userIndex = blog.likedBy.indexOf(userId);
                let updatedBlog;
                if (userIndex === -1) {
                    updatedBlog = yield BlogModel_1.blogModel.findByIdAndUpdate(id, {
                        $push: { likedBy: userId },
                        $inc: { likecount: 1 },
                    }, { new: true });
                }
                else {
                    updatedBlog = yield BlogModel_1.blogModel.findByIdAndUpdate(id, {
                        $pull: { likedBy: userId },
                        $inc: { likecount: -1 },
                    }, { new: true });
                }
                app_1.default.emit("likeStatusUpdated", {
                    blogId: id,
                    likes: updatedBlog.likecount,
                    likedBy: updatedBlog.likedBy,
                });
                return updatedBlog;
            }
            catch (err) {
                console.error("Error:", err);
                throw err;
            }
        });
    }
}
exports.default = new BlogRepository();
