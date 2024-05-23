import rateLimit from "express-rate-limit";
import { RequestHandler } from "express";

const limiterOptions = {
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
};

const limiter: RequestHandler = rateLimit(limiterOptions);

export default limiter;
