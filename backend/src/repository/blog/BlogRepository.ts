import { userModel } from "../user/UserModel";
import { blogModel } from "./BlogModel";
import { IBlog } from "./IBlog";
import { Request, Response } from "express";

class BlogRepository {
  getBlogs = async () => {
    return blogModel.find();
  };

  createBlog = async (
    title: String,
    description: String,
    imageurl: String,
    author: String
  ) => {
    const user = await userModel.findById(author);
    if (!user) {
      throw new Error("User not found");
    }
    const blog = {
      title,
      description,
      imageurl,
      author: user.username,
      authorid : author,
    };
    return await blogModel.create(blog);
  };

  updateBlogById = async (
    id: String,
    title: String,
    description: String,
    imageurl: String
  ) => {
    const blog = {
      title,
      description,
      imageurl,
    };
    return blogModel.findByIdAndUpdate(id, blog, { new: true });
  };

  findBlogById = async (id: String) => {
    return blogModel.findById(id);
  };

  deleteBlog = async (id: string) => {
    return blogModel.findByIdAndDelete(id);
  };

  findBlogsByIds = async (ids: string[]): Promise<IBlog[]> => {
    return blogModel.find({ _id: { $in: ids } });
  };
  
}

export default new BlogRepository();
