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

  findUserById = async (id: string) => {
    return userModel.findById(id);
  };

  findUserByMail = async (email: string) => {
    return userModel.findOne({ email });
  }

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
    const username = body.username;
    const user = await userModel.findOne({ email });
    const name = await userModel.findOne({ username });
    if (name) {
      return {
        error: "Username is already in use. Please use different username.",
      };
    }
    if (!user) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      body.password = hashedPassword;
      return userModel.create(body);
    }
  };

  authUsers = async (body: IUser) => {
    const email = body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      return {
        error: "This mailId is not registered. Please Register to Login",
      };
    }
    if (!user.isVerified) {
      return {
        error: "Email not verified",
      };
    }
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      return { error: "Incorrect password. Please try again." };
    }
    return { user };
  };
}

export default new UserRepository();
