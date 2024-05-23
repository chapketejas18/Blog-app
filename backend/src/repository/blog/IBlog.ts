import mongoose, { Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  description: string;
  imageurl: string;
  author: mongoose.Types.ObjectId;
}
