import fs = require('fs');
import chalk = require('chalk');
import { lineString, lineIntersect } from '@turf/turf';

const data: Array<string> = fs
  // .readFileSync('./data/day2.txt', 'utf-8')
  .readFileSync('./data/day3.txt', 'utf-8')
  .split(/\n/);

const testSetOne = [
  'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
  'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7',
];

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  steps: number;
}

const R = (start: number, next: number) => start + next;
const L = (start: number, next: number) => start - next;
const U = (start: number, next: number) => start - next;
const D = (start: number, next: number) => start + next;

const createLines = (
  collector: Array<Segment>,
  current: string,
): Array<Segment> => {
  // Previous point
  let { x1, x2, y1, y2 } = collector[collector.length - 1];

  let operator: string = current[0];
  let value: number = Number(current.slice(1));
  let coord: number = 0;

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

  let nextPoint: Segment = {
    x1: x2,
    y1: y2,
    x2: operator === 'R' || operator === 'L' ? coord : x2,
    y2: operator === 'U' || operator === 'D' ? coord : y2,
    steps: Math.abs(value),
  };

  return [...collector, nextPoint];
};

const lines = testSetOne.map(str =>
  str
    .split(/\,/)
    .map(el => el.trim())
    .reduce(createLines, [{ x1: 0, y1: 0, x2: 0, y2: 0, steps: 0 }]),
);

let [lineOne, lineTwo] = lines;

let intersections: Array<any> = [];
let lastIndexOfIntersectionLineOne = 0;
let lastIndexOfIntersectionLineTwo = 0;

lineOne.forEach((lineOneSegment, lineOneIndex) => {
  //Skip comparing the 0 route
  if (lineOneIndex <= 1) return;

  let { x1, x2, y1, y2 } = lineOneSegment;

  let lineOneCompareString = lineString([
    [x1, y1],
    [x2, y2],
  ]);

  lineTwo.forEach((lineTwoSegment, lineTwoIndex) => {
    //Skip comparing the 0 route
    if (lineTwoIndex <= 1) return;

    let { x1, x2, y1, y2 } = lineTwoSegment;

    let lineTwoCompareString = lineString([
      [x1, y1],
      [x2, y2],
    ]);

    // Check for intersections
    let intersects = lineIntersect(
      lineOneCompareString,
      lineTwoCompareString,
    );

    if (intersects.features.length) {
      //  x,y of the point of intersection
      let coords = intersects.features[0].geometry?.coordinates || [
        1000,
        1000,
      ];

      let lineOneSlice = lineOne.slice(
        lastIndexOfIntersectionLineOne,
        lineOneIndex + 1,
      );

      let lineOneTotalSteps = lineOneSlice.reduce(
        (acc, curr) => acc + curr.steps,
        0,
      );

      lastIndexOfIntersectionLineOne = lineOneIndex;

      let lineTwoSlice = lineTwo.slice(
        lastIndexOfIntersectionLineTwo,
        lineTwoIndex + 1,
      );

      let lineTwoTotalSteps = lineTwoSlice.reduce(
        (acc, curr) => acc + curr.steps,
        0,
      );

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
      console.log(
        chalk.red('Total Steps: '),
        lineOneTotalSteps + lineTwoTotalSteps,
      );

      intersections.push(coords);
    }
  });
});

// console.log(intersections.map(el => Math.abs(el[0]) + Math.abs(el[1])).sort())
