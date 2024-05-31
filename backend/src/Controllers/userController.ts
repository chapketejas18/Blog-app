import { Request, Response } from "express";
import UserRepository from "../repository/user/UserRepository";
import { userSchema } from "../config/joi";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
        res.status(400).json({ error: error.details[0].message });
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
          subject: "Signup Successful",
          text: `Congratulations! You have successfully signed up to BloggerApp. Click here to login: http://localhost:3000`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "User Signed up Successfully" });
      } else {
        res.status(404).json({ message: "User already exists" });
      }
    } catch (err) {
      console.error("Error:", err);
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
        const token = jwt.sign(
          { existingUser },
          "b44fd2de00412db5ebc7350536b59e86731142f100deef1d486972b9c22e6b11",
          {
            expiresIn: "40m",
          }
        );
        res.status(200).json({ token: token, user: existingUser });
      } else {
        res.status(404).json({
          message: "This mailId is not registered. Please Register to Login",
        });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default new MockDataHandler();
