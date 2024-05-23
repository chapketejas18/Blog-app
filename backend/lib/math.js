const lod = require("lodash");

const add = (a, b) => lod.add(a, b);
const sub = (a, b) => lod.subtract(a, b);
const divide = (a, b) => lod.divide(a, b);
const multiply = (a, b) => lod.multiply(a, b);

module.exports = { add, sub, divide, multiply };
