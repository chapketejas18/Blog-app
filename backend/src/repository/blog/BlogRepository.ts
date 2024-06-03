import io from "../../app";
import { userModel } from "../user/UserModel";
import { blogModel } from "./BlogModel";
import { IBlog } from "./IBlog";

class BlogRepository {
  getBlogs = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return blogModel.find().sort({ createdOn: -1 }).skip(skip).limit(limit);
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
      authorid: author,
    };
    const createdBlog = await blogModel.create(blog);
    io.emit("blogCreated", createdBlog);
    return createdBlog;
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
    const updatedBlog = await blogModel.findByIdAndUpdate(id, blog, {
      new: true,
    });
    io.emit("blogUpdated", updatedBlog);
    return updatedBlog;
  };

  findBlogById = async (id: String) => {
    return blogModel.findById(id);
  };

  deleteBlog = async (id: String) => {
    const deletedBlog = await blogModel.findByIdAndDelete(id);
    io.emit("blogDeleted", id);
    return deletedBlog;
  };

  findBlogsByIds = async (
    ids: string[],
    page: number,
    limit: number
  ): Promise<IBlog[]> => {
    const skip = (page - 1) * limit;
    return blogModel
      .find({ _id: { $in: ids } })
      .sort({ createdOn: -1 })
      .skip(skip)
      .limit(limit);
  };

  likeBlogById = async (id: string, userId: string) => {
    try {
      const blog = await blogModel.findById(id);
      if (!blog) {
        throw new Error("Blog not found");
      }

      const userIndex = blog.likedBy.indexOf(userId);
      let updatedBlog: any;

      if (userIndex === -1) {
        updatedBlog = await blogModel.findByIdAndUpdate(
          id,
          {
            $push: { likedBy: userId },
            $inc: { likecount: 1 },
          },
          { new: true }
        );
      } else {
        updatedBlog = await blogModel.findByIdAndUpdate(
          id,
          {
            $pull: { likedBy: userId },
            $inc: { likecount: -1 },
          },
          { new: true }
        );
      }

      io.emit("likeStatusUpdated", {
        blogId: id,
        likes: updatedBlog.likecount,
        likedBy: updatedBlog.likedBy,
      });

      return updatedBlog;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };
}

export default new BlogRepository();
