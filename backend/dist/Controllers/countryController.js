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
exports.seedCountriesData = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectToDb_1 = require("../utils/connectToDb");
const countryModel_1 = require("../model/countryModel"); // Import the ICountry interface
dotenv_1.default.config();
const dbname = "countries";
function seedCountriesData() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, connectToDb_1.connectToMongoDB)(dbname)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const jsonFilePath = path_1.default.resolve(__dirname, "../../countryData.json");
            const countriesData = require(jsonFilePath);
            yield countryModel_1.CountryModel.insertMany(countriesData);
            console.log("Data seeded successfully!");
        }))
            .catch((error) => {
            console.error("Error seeding data:", error);
        });
    });
}
exports.seedCountriesData = seedCountriesData;
