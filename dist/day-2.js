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
    // .readFileSync('./data/day2.txt', 'utf-8')
    .readFileSync('./data/day2p2.txt', 'utf-8')
    .split(/,/)
    .map(Number);
// const data = [1,1,1,4,99,5,6,0,99]
// let dest = [...data]
var programs = [];
// while (programEnd < data.length) {
//     let slice = dest.slice(programStart,programEnd+1)
//     if (slice[0] === 99) {
//       console.log(dest[0])
//       break
//     }
//     operator(slice)
//     programStart+=4
//     programEnd+=4
// }
var addr1 = 0;
while (addr1 < 100) {
    var addr2 = 0;
    var _loop_1 = function () {
        var programStart = 0;
        var programEnd = 3;
        var dest = __spreadArrays(data);
        var add = function (arr) { return dest[arr[1]] + dest[arr[2]]; };
        var multiply = function (arr) { return dest[arr[1]] * dest[arr[2]]; };
        var operator = function (arr) {
            switch (arr[0]) {
                case 1:
                    dest[arr[3]] = add(arr);
                    break;
                case 2:
                    dest[arr[3]] = multiply(arr);
                    break;
                default:
                    break;
            }
        };
        dest[1] = addr1;
        dest[2] = addr2;
        while (programEnd < data.length) {
            var slice = dest.slice(programStart, programEnd + 1);
            if (slice[0] === 99) {
                if (dest[0] === 19690720) {
                    console.log(addr1, addr2);
                }
                break;
            }
            operator(slice);
            programStart += 4;
            programEnd += 4;
        }
        addr2++;
    };
    while (addr2 < 100) {
        _loop_1();
    }
    addr1++;
}
// programs.map(operator)
// console.log(dest)
