import { Request, Response, NextFunction } from 'express';
import UserRepository from '../repository/user/UserRepository';

const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const { author } = req.body;
  let existingUser;
  try {
    existingUser = await UserRepository.findUserById(author);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User not found for this id" });
  }
  next();
};

export default checkUserExists;
