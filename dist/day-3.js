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
var chalk = require("chalk");
var turf_1 = require("@turf/turf");
var data = fs
    // .readFileSync('./data/day2.txt', 'utf-8')
    .readFileSync('./data/day3.txt', 'utf-8')
    .split(/\n/);
var testSetOne = [
    'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
    'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7',
];
var R = function (start, next) { return start + next; };
var L = function (start, next) { return start - next; };
var U = function (start, next) { return start - next; };
var D = function (start, next) { return start + next; };
var createLines = function (collector, current) {
    // Previous point
    var _a = collector[collector.length - 1], x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
    var operator = current[0];
    var value = Number(current.slice(1));
    var coord = 0;
    switch (operator) {
        case 'R':
            coord = R(x2, value);
            break;
        case 'L':
            coord = L(x2, value);
            break;
        case 'U':
            coord = U(y2, value);
            break;
        case 'D':
            coord = D(y2, value);
            break;
        default:
            0;
    }
    var nextPoint = {
        x1: x2,
        y1: y2,
        x2: operator === 'R' || operator === 'L' ? coord : x2,
        y2: operator === 'U' || operator === 'D' ? coord : y2,
        steps: Math.abs(value),
    };
    return __spreadArrays(collector, [nextPoint]);
};
var lines = testSetOne.map(function (str) {
    return str
        .split(/\,/)
        .map(function (el) { return el.trim(); })
        .reduce(createLines, [{ x1: 0, y1: 0, x2: 0, y2: 0, steps: 0 }]);
});
var lineOne = lines[0], lineTwo = lines[1];
var intersections = [];
var lastIndexOfIntersectionLineOne = 0;
var lastIndexOfIntersectionLineTwo = 0;
lineOne.forEach(function (lineOneSegment, lineOneIndex) {
    //Skip comparing the 0 route
    if (lineOneIndex <= 1)
        return;
    var x1 = lineOneSegment.x1, x2 = lineOneSegment.x2, y1 = lineOneSegment.y1, y2 = lineOneSegment.y2;
    var lineOneCompareString = turf_1.lineString([
        [x1, y1],
        [x2, y2],
    ]);
    lineTwo.forEach(function (lineTwoSegment, lineTwoIndex) {
        var _a;
        //Skip comparing the 0 route
        if (lineTwoIndex <= 1)
            return;
        var x1 = lineTwoSegment.x1, x2 = lineTwoSegment.x2, y1 = lineTwoSegment.y1, y2 = lineTwoSegment.y2;
        var lineTwoCompareString = turf_1.lineString([
            [x1, y1],
            [x2, y2],
        ]);
        // Check for intersections
        var intersects = turf_1.lineIntersect(lineOneCompareString, lineTwoCompareString);
        if (intersects.features.length) {
            //  x,y of the point of intersection
            var coords = ((_a = intersects.features[0].geometry) === null || _a === void 0 ? void 0 : _a.coordinates) || [
                1000,
                1000,
            ];
            var lineOneSlice = lineOne.slice(lastIndexOfIntersectionLineOne, lineOneIndex + 1);
            var lineOneTotalSteps = lineOneSlice.reduce(function (acc, curr) { return acc + curr.steps; }, 0);
            lastIndexOfIntersectionLineOne = lineOneIndex;
            var lineTwoSlice = lineTwo.slice(lastIndexOfIntersectionLineTwo, lineTwoIndex + 1);
            var lineTwoTotalSteps = lineTwoSlice.reduce(function (acc, curr) { return acc + curr.steps; }, 0);
            lastIndexOfIntersectionLineTwo = lineTwoIndex;
            // Adjust Line One
            // If no change in X, adjust Y
            if (lineOneSegment.x1 === lineOneSegment.x2)
                lineOneTotalSteps -= lineOneSegment.y2 - coords[1];
            // If no change in Y, adjust X
            if (lineOneSegment.y1 === lineOneSegment.y2)
                lineOneTotalSteps -= lineOneSegment.x2 - coords[0];
            // Adjust Line Two
            // If no change in X, adjust Y
            if (lineTwoSegment.x1 === lineTwoSegment.x2)
                lineTwoTotalSteps -= lineTwoSegment.y2 - coords[1];
            // If no change in Y, adjust X
            if (lineTwoSegment.y1 === lineTwoSegment.y2)
                lineTwoTotalSteps -= lineTwoSegment.x2 - coords[0];
            // console.log(chalk.blue('Intersection: '), coords);
            // console.log(chalk.blue('Last Coord: '), x2, y2);
            // console.log(
            //   chalk.blue('Line One Segment: '),
            //   lineOneSlice.map(segment => segment.steps),
            //   chalk.blue(' = '),
            //   lineOneSlice
            //     .map(segment => segment.steps)
            //     .reduce((acc, curr) => acc + curr, 0),
            // );
            // console.log(
            //   chalk.blue('Line Two Segment: '),
            //   lineTwoSlice.map(segment => segment.steps),
            //   chalk.blue(' = '),
            //   lineTwoSlice
            //     .map(segment => segment.steps)
            //     .reduce((acc, curr) => acc + curr, 0),
            // );
            // console.log(
            //   chalk.blue('Line One Total Steps: '),
            //   lineOneTotalSteps,
            // );
            // console.log(
            //   chalk.blue('Line Two Total Steps: '),
            //   lineTwoTotalSteps,
            // );
            console.log(chalk.red('Total Steps: '), lineOneTotalSteps + lineTwoTotalSteps);
            intersections.push(coords);
        }
    });
});
// console.log(intersections.map(el => Math.abs(el[0]) + Math.abs(el[1])).sort())
