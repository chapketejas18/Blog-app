"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const connectToDb_1 = require("./utils/connectToDb");
const userRouter_1 = __importDefault(require("./Routes/userRouter"));
const logRequest_1 = __importDefault(require("./Middleware/logRequest"));
const errorHandler_1 = __importDefault(require("./Middleware/errorHandler"));
const requestLimiter_1 = __importDefault(require("./Middleware/requestLimiter"));
const app_1 = __importDefault(require("firebase/compat/app"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const PORT = process.env.PORT || 9000;
(0, connectToDb_1.connectToMongoDB)();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(requestLimiter_1.default);
app.use(logRequest_1.default);
const firebaseConfig = {
    apiKey: "AIzaSyC7DLM6rspr6JgoooPkTE1Zb2QZXdcjxQo",
    authDomain: "blogs-93765.firebaseapp.com",
    projectId: "blogs-93765",
    storageBucket: "blogs-93765.appspot.com",
    messagingSenderId: "911912315585",
    appId: "1:911912315585:web:9f2c8a7e77a1a8610c4240",
};
app_1.default.initializeApp(firebaseConfig);
app.use("/api", userRouter_1.default);
app.use(errorHandler_1.default);
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
});
exports.default = io;
server.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});
