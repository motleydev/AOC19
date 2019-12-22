"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var data = fs
    .readFileSync('./data/day1.txt', 'utf-8')
    .split(/\n/)
    .map(Number);
var mTf = function (input) { return Math.floor(input / 3) - 2; };
var recursiveMass = function (input, collection) {
    if (collection === void 0) { collection = []; }
    if (mTf(input) > 0) {
        return recursiveMass(mTf(input), __spreadArrays(collection, [mTf(input)]));
    }
    var result = collection.reduce(function (collector, current) {
        return collector + current;
    }, 0);
    console.log(result);
    return result;
};
var result = data.reduce(function (collection, current) {
    return collection + recursiveMass(current);
}, 0);
console.log(result);
