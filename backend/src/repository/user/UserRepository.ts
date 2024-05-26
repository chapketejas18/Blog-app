import { IUser } from "./IUserModel";
import { userModel } from "./UserModel";
import bcrypt from "bcrypt";
import { IBlog } from "../blog/IBlog";

class UserRepository {
  getAllUsers = async () => {
    return userModel.find();
  };

  createUser = async (body: IUser) => {
    return userModel.create(body);
  };

  findUserById = async (id: String) => {
    return userModel.findById(id);
  };

  deletdUserById = async (id: string) => {
    return userModel.findByIdAndDelete(id);
  };

  updateDataById = async (id: string, body: Partial<IUser>) => {
    return userModel.findByIdAndUpdate(id, body, { new: true });
  };

  updateUserByBlog = async (id: string, blogid: string) => {
    return userModel.findOneAndUpdate(
      { _id: id },
      { $addToSet: { blogs: blogid } }
    );
  };

  deleteBlogOfUser = async (body: IBlog) => {
    return userModel.findOneAndUpdate(
      { _id: body.authorid },
      { $pull: { blogs: body.id } },
      { new: true }
    );
  };

  registerUser = async (body: IUser) => {
    const email = body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      return userModel.create(body);
    }
  };

  authUsers = async (body: IUser) => {
    const email = body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      return null;
    }
    if (user.password !== body.password) {
      return null;
    }
    return user;
  };
}

export default new UserRepository();
