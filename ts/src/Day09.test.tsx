import _, { concat } from "lodash";
import {sampleInput, actualInput} from './Day09Input'

export {}

type Position = [row:number,column:number]

const getNeighborPositions = (inputs:number[][], pos:Position):Position[] => {
    const [row, col] = pos;

    const badPosition:Position = [-1,-1];
    const possibleNeighbors = [ [row-1,col], [row+1,col], [row,col-1], [row,col+1] ]
    
    const height = inputs.length;
    return possibleNeighbors.map(([r,c])=>{
        if (r<0) return badPosition
        if (r>=height) return badPosition
        const width = inputs[r].length;
        if (c<0) return badPosition
        if (c>=width) return badPosition
        const output:Position = [r,c];
        return output;
    }).filter(xs => !(xs === badPosition))
}

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

const except = (neighbors:Position[], alreadySearched:Position[]) : Position[] => {
    const newNeighbors = neighbors.filter(([neighborRow, neighborCol]) => {
        const alreadyFound = alreadySearched.some(([oldRow, oldCol]) => (oldRow === neighborRow) && (oldCol === neighborCol));
        return !alreadyFound
    });
    return newNeighbors;
}

const getBasin = (inputs:number[][], start:Position) : Position[] => {
    let queue = [start];
    let alreadySearched:Position[] = [];

    while (queue.length > 0) {
        const pos = queue.shift(); // pop
        if (!pos) throw new Error("make the compiler happy")

        const neighbors = getNeighborPositions(inputs, pos);
        const goodNeighbors = neighbors.filter(([row,col])=>!(inputs[row][col]===9));
        const newNeighbors = except(except(goodNeighbors, alreadySearched), queue); // not already searched or queued

        alreadySearched = [...alreadySearched, pos];
        queue = [...queue,...newNeighbors];
    }
    
    return alreadySearched;
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