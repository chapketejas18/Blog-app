import { Request, Response } from "express";
import BlogRepository from "../repository/blog/BlogRepository";
import UserRepository from "../repository/user/UserRepository";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
class blogController {
  getAllBlogs = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 2;
      const blogs = await BlogRepository.getBlogs(page, limit);
      res.json(blogs);
    } catch (err) {
      const typedError = err;
      res.status(500).json({ error: typedError });
    }
  };

  addBlog = async (req: Request, res: Response) => {
    const { title, description, imageurl, author } = req.body;
    try {
      const blog = await BlogRepository.createBlog(
        title,
        description,
        imageurl,
        author
      );
      const blogId = blog.id;
      const updatedBlog = await UserRepository.updateUserByBlog(author, blogId);
      if (!updatedBlog) {
        return res.status(400).json({ message: "Error while creating data" });
      }
      res.status(200).json({ message: "Created successfully!!!" });
    } catch (err) {
      const typedError = err as Error;
      res.status(500).json({ error: typedError.message });
    }
  };

  updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { title, description, imageurl } = req.body;

      const updatedBlog = await BlogRepository.updateBlogById(
        id,
        title,
        description,
        imageurl
      );
      if (!updatedBlog) {
        res.status(404).json({ message: "No Blog found for this ID" });
        return;
      }
      res.json({ status: "Updated Successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const blog = await BlogRepository.findBlogById(id);
      if (!blog) {
        res.status(404).json({ error: "Blog not found" });
        return;
      }
      res.json(blog);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  deleteBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const deletedBlog = await BlogRepository.deleteBlog(id);
      if (!deletedBlog) {
        res.status(404).json({ message: "No Blog found for this ID" });
        return;
      }
      const imageUrl = deletedBlog.imageurl;
      if (imageUrl) {
        const storageRef = firebase.storage().refFromURL(imageUrl);
        await storageRef.delete();
        console.log("Image deleted from Firebase");
      }
      await UserRepository.deleteBlogOfUser(deletedBlog);
      res.json({ status: "Deleted Successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getBlogsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const existingUser = await UserRepository.findUserById(id);
      if (!existingUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const blogIds = existingUser.blogs;
      if (!blogIds || blogIds.length === 0) {
        res.status(404).json({ message: "No blogs found for this user" });
        return;
      }
      const stringIds = blogIds.map((id) => id.toString());
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 2;
      const blogs = await BlogRepository.findBlogsByIds(stringIds, page, limit);
      res.json(blogs);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  likeBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const blogId = req.params.id;
      const userid = req.body.userid;
      if (!userid) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }
      const updatedBlog = await BlogRepository.likeBlogById(blogId, userid);
      res.json({
        message: "Like status updated successfully",
        blog: updatedBlog,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default new blogController();
