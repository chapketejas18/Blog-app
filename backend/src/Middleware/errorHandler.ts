import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || "Internal Server Error";
  if (!err.statusCode && !err.message) {
    statusCode = 500;
    errorMessage = "Internal Server Error";
  }
  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;
