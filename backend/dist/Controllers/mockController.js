"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockController = void 0;
const mock_1 = require("../mock");
const mockController = (req, res) => {
    // console.log(mockData);
    const { country, state } = req.query;
    console.log(country);
    const data = mock_1.mockData.filter((item) => {
        if (item.country === country) {
            return item.state;
        }
        if (item.state === state) {
            return item.country;
        }
    });
    if (data.length === 0) {
        res.json({ error: `No data found for ${country}. Enter valid Country` });
    }
    res.json({
        message: `${data.length} states retrieved with country : ${country}`,
        data: {
            country: country,
            state: data.map((item) => item.state),
        },
    });
};
exports.mockController = mockController;
/**
 * {
 * message: 5 states retrieved associated with country: IN,
 * data: {
 * country: 'IN',
 * state: [s1, s2, s3]
 * }
 * }
 */
