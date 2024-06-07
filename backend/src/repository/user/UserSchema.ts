import mongoose, { Schema } from "mongoose";
import { IUser } from "./IUserModel";

export const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
});
