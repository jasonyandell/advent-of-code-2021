import * as _ from "lodash";
import {sampleInput, actualInput} from './Day05Input';

const mapTheOcean = (input:string[], includeDiagonals:boolean = false) : number => {
  const size = 1000;
  const oceanFloor:number[][] = new Array(size).fill(0).map(() => new Array(size).fill(0));

  const print = (nums:number[][]) => nums.map(numsRow => numsRow.reduce((s,n)=>s += (n==0)?'.':n, '')).join('\n');

  const mapLine = (line:string) => {
    const points = line.match(/(\d+),(\d+) -> (\d+),(\d+)/)?.slice(1).map(x=>+x) ?? [];
    const [x1,y1,x2,y2] = points;

    if (!(includeDiagonals || (x1===x2) || (y1===y2))) return;

    const getRange = (a:number, b:number) : number[] => [..._.range(a,b),b];

    const xRange = getRange(x1,x2);
    const yRange = getRange(y1,y2);
    const rangeLength = Math.max(xRange.length, yRange.length);

    _.range(0,rangeLength).map(i => {
      const get = (xs:number[]) => i<xs.length ? xs[i] : xs[0];
      const x = get(xRange);
      const y = get(yRange);
      oceanFloor[y][x]++;
    })
  };

  input.map(line => mapLine(line))

  const intersections = oceanFloor.flat().filter(x => x > 1);
  return intersections.length;
}

test('problem 1 sample output is 5', () => {
  const output = mapTheOcean(sampleInput);
  expect(output).toEqual(5);
})

test('problem 1 actual is..', () => {
  const output = mapTheOcean(actualInput);
  console.log("Day 5, Problem 1", output)
});

test('problem 2 sample output is 12', () => {
  const output = mapTheOcean(sampleInput, true);
  expect(output).toEqual(12);
})

test('problem 2 actual is..', () => {
  const output = mapTheOcean(actualInput, true);
  console.log("Day 5, Problem 1", output)
});
