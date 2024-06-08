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
const UserModel_1 = require("./UserModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepository {
    constructor() {
        this.getAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.find();
        });
        this.createUser = (body) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.create(body);
        });
        this.findUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.findById(id);
        });
        this.findUserByMail = (email) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.findOne({ email });
        });
        this.deletdUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.findByIdAndDelete(id);
        });
        this.updateDataById = (id, body) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.findByIdAndUpdate(id, body, { new: true });
        });
        this.updateUserByBlog = (id, blogid) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.findOneAndUpdate({ _id: id }, { $addToSet: { blogs: blogid } });
        });
        this.deleteBlogOfUser = (body) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userModel.findOneAndUpdate({ _id: body.authorid }, { $pull: { blogs: body.id } }, { new: true });
        });
        this.registerUser = (body) => __awaiter(this, void 0, void 0, function* () {
            const email = body.email;
            const username = body.username;
            const user = yield UserModel_1.userModel.findOne({ email });
            const name = yield UserModel_1.userModel.findOne({ username });
            if (name) {
                return {
                    error: "Username is already in use. Please use different username.",
                };
            }
            if (!user) {
                const hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
                body.password = hashedPassword;
                return UserModel_1.userModel.create(body);
            }
        });
        this.authUsers = (body) => __awaiter(this, void 0, void 0, function* () {
            const email = body.email;
            const user = yield UserModel_1.userModel.findOne({ email });
            if (!user) {
                return {
                    error: "This mailId is not registered. Please Register to Login",
                };
            }
            if (!user.isVerified) {
                return {
                    error: "Email not verified",
                };
            }
            const validPassword = yield bcrypt_1.default.compare(body.password, user.password);
            if (!validPassword) {
                return { error: "Incorrect password. Please try again." };
            }
            return { user };
        });
    }
}
exports.default = new UserRepository();
