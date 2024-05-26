import mongoose, { Schema } from "mongoose";
import { IBlog } from "./IBlog";

export const blogSchema: Schema<IBlog> = new Schema({
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
  likedBy:{
    type : [String],
    ref:"User",
  },
  likecount:{
    type:Number,
    default:0
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});
