import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectToMongoDB } from "./utils/connectToDb";
import userRouter from "./Routes/userRouter";
import logRequest from "./Middleware/logRequest";
import errorHandler from "./Middleware/errorHandler";
import limiter from "./Middleware/requestLimiter";
import firebase from "firebase/compat/app";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 9000;

connectToMongoDB();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(limiter);
app.use(logRequest);

const firebaseConfig = {
  apiKey: "AIzaSyC7DLM6rspr6JgoooPkTE1Zb2QZXdcjxQo",
  authDomain: "blogs-93765.firebaseapp.com",
  projectId: "blogs-93765",
  storageBucket: "blogs-93765.appspot.com",
  messagingSenderId: "911912315585",
  appId: "1:911912315585:web:9f2c8a7e77a1a8610c4240",
};

firebase.initializeApp(firebaseConfig);

app.use("/api", userRouter);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
});

export default io;

server.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
