import mongoose, { Model } from "mongoose";
import { IUser } from "./IUserModel";
import { userSchema } from "./UserSchema";

export const userModel: Model<IUser> = mongoose.model<IUser>(
  "users",
  userSchema
);
