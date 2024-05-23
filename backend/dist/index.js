"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "../.env",
});
const server_1 = __importDefault(require("./server"));
const db_1 = __importDefault(require("./config/db"));
const country_1 = __importDefault(require("./country"));
const country_2 = __importDefault(require("./models/country"));
const PORT = process.env.PORT || 4001;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        yield seedDB();
        (0, server_1.default)().listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}`);
        });
    }
    catch (err) {
        console.log("Mongo db connection failed", err);
    }
});
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield country_2.default.deleteMany({});
        yield country_2.default.insertMany(country_1.default);
    }
    catch (err) {
        console.error("Error seeding database:", err);
    }
});
startServer();
