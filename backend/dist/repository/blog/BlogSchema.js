"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const mongoose_1 = require("mongoose");
exports.blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageurl: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        ref: "User",
        required: true,
    },
    authorid: {
        type: String,
        ref: "User",
        required: true,
    },
    likedBy: {
        type: [String],
        ref: "User",
    },
    likecount: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: () => new Date(),
    },
});
