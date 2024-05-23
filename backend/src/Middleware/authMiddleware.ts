import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRECT_KEY;

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization as string;

  if (!token) {
    res.status(401).json({ error: "Authentication failed. Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed. Invalid token." });
  }
};

export default authenticate;
