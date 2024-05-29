import Joi, { Schema } from "joi";

export const userSchema: Schema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().pattern(
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&#])[a-zA-Z0-9@$!%*?&#]{7,30}$/
  ),
});

export const blogSchema: Schema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});
