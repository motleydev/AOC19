import fs = require('fs');
import chalk = require('chalk');
import { lineString, lineIntersect } from '@turf/turf';

const data: Array<string> = fs
  // .readFileSync('./data/day2.txt', 'utf-8')
  .readFileSync('./data/day3.txt', 'utf-8')
  .split(/\n/);

let finalSteps: Array<number> = [];

const testSetOne = [
  'R75,D30,R83,U83,L12,D49,R71,U7,L72',
  'U62,R66,U55,R34,D71,R55,D58,R83',
];

const testSetTwo = [
  'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
  'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7',
];

// The shape of my line (wire) segments
interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  steps?: number;
}

// Sum Step Reducer

let sumSteps = (acc: number, curr: Segment) =>
  acc + (curr.steps || 0);

// Functions to create x2/y2 respectively on a grid
const R = (start: number, next: number) => start + next;
const L = (start: number, next: number) => start - next;
const U = (start: number, next: number) => start - next;
const D = (start: number, next: number) => start + next;

// Store for original step lengths
let stepTracker = new Map();

// Reducer for parsing the wire segments
const createLines = (
  collector: Array<Segment>,
  current: string,
): Array<Segment> => {
  // Previous point
  let { x1, x2, y1, y2 } = collector[collector.length - 1];

  // Direction of the ray (UDLR)
  let operator: string = current[0];
  // Magnitude of the ray
  let value: number = Number(current.slice(1));
  // The new coordinate, set below
  let coord: number = 0;

  // Set coord to a positive or negative value on the a 0,0 grid
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

  // Determine the values of the next wire / ray segment
  let nextPoint: Segment = {
    x1: x2,
    y1: y2,
    x2: operator === 'R' || operator === 'L' ? coord : x2,
    y2: operator === 'U' || operator === 'D' ? coord : y2,
  };

  let positionCoordAsString = [nextPoint.x2, nextPoint.y2].toString();

  // If no steps, set them
  if (!stepTracker.has(positionCoordAsString)) {
    stepTracker.set(positionCoordAsString, Math.abs(value));
  }

  // Get the next steps
  nextPoint.steps = stepTracker.get(positionCoordAsString);

  return [...collector, nextPoint];
};

// Apply formatting to the strings
// Replace testSetOne with data
const lines = data.map(str =>
  str
    .split(/\,/)
    .map(el => el.trim())
    .reduce(createLines, [{ x1: 0, y1: 0, x2: 0, y2: 0, steps: 0 }]),
);

// Split into two wires
let [lineOne, lineTwo] = lines;

// A collector for all the intersections, for part 1
let intersections: Array<any> = [];

// Map over each segment of the first wire
lineOne.forEach((lineOneSegment, lineOneIndex) => {
  //Skip comparing the 0 route
  if (lineOneIndex <= 1) return;

  // Construct a lineString from wire one for comparison
  let { x1, x2, y1, y2 } = lineOneSegment;
  let lineOneCompareString = lineString([
    [x1, y1],
    [x2, y2],
  ]);

  // For every wire segment of wire one,
  // check to see if there's a collision with a wire segment of line two
  lineTwo.forEach((lineTwoSegment, lineTwoIndex) => {
    //Skip comparing the 0 route
    if (lineTwoIndex <= 1) return;

    // Construct a lineString from wire two for comparison
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

    // If an intersection occurred
    if (intersects.features.length) {
      //  x,y of the point of intersection
      let coords = intersects.features[0].geometry?.coordinates || [
        1000,
        1000,
      ];
      // I added defaults because it helped me avoid
      // forced null checking that typescript mandiates with that
      // level of reading nested properties.
      // the '?.' access is a new syntax for checking properties.

      // Slice all wire segments on line one up to the current wire point
      // note +1 for all segments inclusive.
      let lineOneSlice = lineOne.slice(0, lineOneIndex + 1);

      // Sum the steps from those segments
      let lineOneTotalSteps = lineOneSlice.reduce(sumSteps, 0);

      // Slice all wire segments on line two up to the current wire point
      // note +1 for all segments inclusive.
      let lineTwoSlice = lineTwo.slice(0, lineTwoIndex + 1);

      // Sum the steps from those segments
      let lineTwoTotalSteps = lineTwoSlice.reduce(sumSteps, 0);

      // Adjust Line One since the end point of a wire segment
      // is not the same as the point of intersection

      // If no change in X, adjust Y
      if (lineOneSegment.x1 === lineOneSegment.x2)
        lineOneTotalSteps -= Math.abs(lineOneSegment.y2 - coords[1]);
      // If no change in Y, adjust X
      if (lineOneSegment.y1 === lineOneSegment.y2)
        lineOneTotalSteps -= Math.abs(lineOneSegment.x2 - coords[0]);

      // Adjust Line Two since the end point of a wire segment
      // is not the same as the point of intersection

      // If no change in X, adjust Y
      if (lineTwoSegment.x1 === lineTwoSegment.x2)
        lineTwoTotalSteps -= Math.abs(lineTwoSegment.y2 - coords[1]);
      // If no change in Y, adjust X
      if (lineTwoSegment.y1 === lineTwoSegment.y2)
        lineTwoTotalSteps -= Math.abs(lineTwoSegment.x2 - coords[0]);

      finalSteps.push(lineOneTotalSteps + lineTwoTotalSteps);

      console.log(
        chalk.red('Total Steps: '),
        lineOneTotalSteps + lineTwoTotalSteps,
      );

      // Collect all the intersections for part 1
      intersections.push(coords);
    }
  });
});

console.log('Smallest: ', finalSteps.sort()[0]);

// Find the closest intersection (from part 1)
// console.log(intersections.map(el => Math.abs(el[0]) + Math.abs(el[1])).sort())
