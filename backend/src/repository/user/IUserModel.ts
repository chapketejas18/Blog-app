import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  blogs: mongoose.Types.ObjectId[];
}
