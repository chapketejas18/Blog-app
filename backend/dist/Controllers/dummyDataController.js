"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DummyDataHandler {
    constructor() {
        this.generateDummyData = (req, res, next) => {
            const mockData = [];
            for (let i = 1; i <= 10; i++) {
                mockData.push({
                    id: i,
                    name: `User ${i}`,
                    email: `user${i}@example.com`,
                    age: Math.floor(Math.random() * 50) + 20,
                });
            }
            req.mockData = mockData;
            next();
        };
        this.writeDummyDataToFile = (req, res) => {
            const mockData = req.mockData;
            const mockDataPath = path_1.default.join(__dirname, "../../", "dummyData.json");
            fs_1.default.writeFile(mockDataPath, JSON.stringify(mockData), (err) => {
                if (err) {
                    res.status(500).send("Error writing mock data to file");
                }
                else {
                    res.send("Mock data generated and written to file.");
                }
            });
        };
        this.getDummyData = (req, res) => {
            try {
                const mockData = require("../../dummyData.json");
                if (mockData.length === 0) {
                    res.status(404).json({
                        error: "No data available at this moment!! Please try again later...",
                    });
                }
                else {
                    res.json(mockData);
                }
            }
            catch (error) {
                const errnoError = error;
                if (errnoError.code === "MODULE_NOT_FOUND") {
                    res.status(404).json({
                        error: "No file and data",
                    });
                }
                else {
                    res.status(500).json({
                        error: "Internal server error",
                    });
                }
            }
        };
    }
}
exports.default = new DummyDataHandler();
