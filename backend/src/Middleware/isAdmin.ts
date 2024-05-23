import { Request, Response, NextFunction } from "express";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const role = req.user.existingUser.role;
  if (role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not an admin" });
  }
};

export default isAdmin;
