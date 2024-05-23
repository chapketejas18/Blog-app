import mongoose, { Model } from "mongoose";
import { IBlog } from "./IBlog";
import { blogSchema } from "./BlogSchema";

export const blogModel: Model<IBlog> = mongoose.model<IBlog>(
  "blog",
  blogSchema
);
