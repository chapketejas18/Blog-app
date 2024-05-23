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
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
