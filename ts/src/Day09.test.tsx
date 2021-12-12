import _, { concat } from "lodash";
import {Position, gridNeighbors4} from './grid'

import {sampleInput, actualInput} from './Day09Input'

export {}

const getNeighborPositions = gridNeighbors4

const getLowPoints = (inputs:number[][]):Position[] => {
    let lowPoints:Position[] = []
    const height = inputs.length
    for(let row=0; row<height; row++) {
        const width = inputs[row].length;
        for (let col=0; col<width; col++) {
            const localValue = inputs[row][col]
            const localValues = getNeighborPositions(inputs, [row,col]).map(([r,c])=>inputs[r][c]);
            const lowestValue = localValues.reduce((a,b)=>Math.min(a,b))
            if (localValue < lowestValue) lowPoints.push([row,col]);
        }
    }
    return lowPoints
}

const getRisk = (inputs:number[][]) : number => {
    const totalRisk = getLowPoints(inputs).map(([r,c])=>inputs[r][c]+1).reduce((a,b)=>a+b)
    return totalRisk;
}

// const except = (lhs:Position[], rhs:Position[]) : Position[] => {
//     const newNeighbors = lhs.filter(([leftRow, leftCol]) => {
//         const alreadyFound = rhs.some(([rightRow, rightCol]) => (rightRow === leftRow) && (rightCol === leftCol));
//         return !alreadyFound
//     });
//     return newNeighbors;
// }

const search = <T extends unknown>(start:T, getNeighbors:(pos:T)=>T[], isValidPosition : (pos:T)=>boolean) => {
    let queue:T[] = [start];
    let alreadySearched:T[] = [];

    while (queue.length > 0) {
        const pos = queue.shift(); // pop
        if (!pos) throw new Error("make the compiler happy")

        const neighbors = getNeighbors(pos);
        const goodNeighbors = neighbors.filter(isValidPosition);
        const newNeighbors = _.differenceWith(_.differenceWith(goodNeighbors, alreadySearched, _.isEqual), queue, _.isEqual);

        alreadySearched = [...alreadySearched, pos];
        queue = [...queue,...newNeighbors];
    }
    
    return alreadySearched;
}

const getBasin = (inputs:number[][], start:Position) : Position[] => {
    const neighbors = (pos:Position) => gridNeighbors4(inputs, pos);
    const filter = ([row,col]:Position) => !(inputs[row][col] === 9)
    const basin = search(start, neighbors, filter)

    return basin;
}

const findBasinsSizeProduct = (input:number[][]):number => {
    const basins = getLowPoints(input).map(lowPoint=>getBasin(input, lowPoint))
    const sizes = basins.map(basin => basin.length);
    sizes.sort(function(a, b){return b-a})
    const product = sizes.slice(0,3).reduce((a,b)=>a*b)
    return product;
}

test('sample basin has 9 members', () => {
    const output = getBasin(sampleInput, [0,9]);
    expect(output.length).toBe(9);
})

test('problem 2 sample is 1134', () => {
    const output = findBasinsSizeProduct(sampleInput);
    expect(output).toBe(1134)
})

test('problem 2 actual is ...', () => {
    const output = findBasinsSizeProduct(actualInput);
    console.log("Day 9, Problem 2", output)
})

test('problem 1 sample is 15', () => {
    const risk = getRisk(sampleInput)
    expect(risk).toBe(15);
})

test('problem 1 actual is..', () => {
    const risk = getRisk(actualInput)
    console.log("Day 9, Problem 1", risk)
})