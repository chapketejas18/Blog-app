import { Request, Response } from "express";
import UserRepository from "../repository/user/UserRepository";
import { userSchema } from "../config/joi";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv = require("dotenv");
import { userModel } from "../repository/user/UserModel";
dotenv.config();

const secrectKey: string = process.env.SECRECT_KEY || "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tejaschapke21@gmail.com",
    pass: "oapv nwih elpz yzrj",
  },
});

class MockDataHandler {
  getData = async (request: Request, response: Response) => {
    try {
      const users = await UserRepository.getAllUsers();
      response.json(users);
    } catch (err) {
      const typedError = err;
      response.status(500).json({ error: typedError });
    }
  };

  createData = async (req: Request, res: Response): Promise<void> => {
    try {
      let body = req.body;
      const { error } = userSchema.validate(body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }
      const userWithBlog = { ...body, blogs: [] };
      await UserRepository.createUser(userWithBlog);
      res.json({ status: "Created Successfully" });
    } catch (error) {
      console.log("Error creating data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getDataById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      const user = await UserRepository.findUserById(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  deleteDataById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const deletedUser = await UserRepository.deletdUserById(id);
      if (!deletedUser) {
        res.status(404).json({ message: "No data found for this ID" });
        return;
      }
      res.json({ status: "Deleted Successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateDataById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const body = req.body;

      const { error } = userSchema.validate(body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const updatedUser = await UserRepository.updateDataById(id, body);
      if (!updatedUser) {
        res.status(404).json({ message: "No data found for this ID" });
        return;
      }
      res.json({ status: "Updated Successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const mail = body.email;
      const { error } = userSchema.validate(body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const createdUser: any = await UserRepository.registerUser(body);
      if (createdUser.error) {
        return res.status(400).json({ message: createdUser.error });
      }
      if (createdUser) {
        const mailOptions = {
          from: "tejaschapke21@gmail.com",
          to: mail,
          subject: "Signup Successful. Please verify your account.",
          text: `Congratulations! You have successfully signed up to BloggerApp. Click here to verify: http://localhost:9000/api/verify/${createdUser._id}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "User Signed up Successfully",createdUser });
      } else {
        res.status(404).json({ message: "User already exists" });
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const user = await UserRepository.findUserById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      if (user.isVerified) {
        res.status(400).json({ error: "Email already verified" });
        return;
      }
      user.isVerified = true;
      await user.save();
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const existingUser = await UserRepository.authUsers(body);
      if (existingUser.error) {
        return res.status(401).json({ message: existingUser.error });
      }
      if (existingUser) {
        const token = jwt.sign({ existingUser }, secrectKey, {
          expiresIn: "40m",
        });
        res.status(200).json({ token: token,existingUser });
      } else {
        res.status(404).json({
          message: "This mailId is not registered. Please Register to Login",
        });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  googleLogin = async (req: Request, res: Response) => {
    const { email, name } = req.body;

    try {
      let user = await UserRepository.findUserByMail(email);

      if (!user) {
        user = new userModel({
          email,
          username: name,
          password: "",
          isVerified: true,
          blogs: [],
        });
        await UserRepository.registerUser(user);
      }
      const token = jwt.sign({ existingUser:{user}}, secrectKey, { expiresIn: "1h" });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };

}

export default new MockDataHandler();
