"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const data = fs
    .readFileSync('./data/day1.txt', 'utf-8')
    .split(/\n/)
    .map(Number);
const mTf = (input) => Math.floor(input / 3) - 2;
const recursiveMass = (input, collection = []) => {
    if (mTf(input) > 0) {
        return recursiveMass(mTf(input), [...collection, mTf(input)]);
    }
    const result = collection.reduce((collector, current) => {
        return collector + current;
    }, 0);
    console.log(result);
    return result;
};
const result = data.reduce((collection, current) => {
    return collection + recursiveMass(current);
}, 0);
console.log(result);
