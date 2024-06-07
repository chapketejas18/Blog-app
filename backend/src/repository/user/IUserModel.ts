import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  blogs: mongoose.Types.ObjectId[];
  isVerified: boolean;
}
