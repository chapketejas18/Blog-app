import mongoose from "mongoose";
import dotenv = require("dotenv");
dotenv.config();

const url: string = process.env.MONGODB_URL || "";

export async function connectToMongoDB() {
  try {
    const client = await mongoose.connect(url);
    console.log("Successful connection with the server");
    return client;
  } catch (err) {
    console.log("Error in the connectivity:", err);
    throw err;
  }
}
