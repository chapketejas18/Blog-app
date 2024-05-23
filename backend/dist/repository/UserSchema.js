"use strict";
// import mongoose, { Document, Schema, Model } from "mongoose";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
// interface ICountry extends Document {
//   name: string;
//   code: string;
//   playing: boolean;
// }
//
// const Country: Model<ICountry> = mongoose.model<ICountry>(
//   "Country",
//   countrySchema
// );
// export default Country;
exports.userSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
});
