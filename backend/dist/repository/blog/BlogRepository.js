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
const UserModel_1 = require("../user/UserModel");
const BlogModel_1 = require("./BlogModel");
class BlogRepository {
    constructor() {
        this.getBlogs = () => __awaiter(this, void 0, void 0, function* () {
            return BlogModel_1.blogModel.find();
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
            };
            return yield BlogModel_1.blogModel.create(blog);
        });
        this.updateBlogById = (id, title, description, imageurl) => __awaiter(this, void 0, void 0, function* () {
            const blog = {
                title,
                description,
                imageurl,
            };
            return BlogModel_1.blogModel.findByIdAndUpdate(id, blog, { new: true });
        });
        this.findBlogById = (id) => __awaiter(this, void 0, void 0, function* () {
            return BlogModel_1.blogModel.findById(id);
        });
        this.deleteBlog = (id) => __awaiter(this, void 0, void 0, function* () {
            return BlogModel_1.blogModel.findByIdAndDelete(id);
        });
        this.findBlogsByIds = (ids) => __awaiter(this, void 0, void 0, function* () {
            return BlogModel_1.blogModel.find({ _id: { $in: ids } });
        });
    }
}
exports.default = new BlogRepository();
