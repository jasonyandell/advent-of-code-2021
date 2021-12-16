import { TestScheduler } from '@jest/core'
import '@testing-library/jest-dom'
import _ from 'lodash'
import { sampleInput, actualInput } from './Day15Input'
import {Position, pretty, gridNeighbors4} from './grid'

type Node = {cost:number, pos:Position}

const getCostArray = (size:number):number[][] => {
    const array: number[][] = new Array(size).fill(Number.MAX_SAFE_INTEGER)
        .map(() => new Array(size).fill(Number.MAX_SAFE_INTEGER));
    return array;
}

export const printableGrid = (grid:number[][]):string => grid.map(row => row.reduce((p,col)=>p+(("    "+col).slice(-4)),"")).join("\n ")

const costOf = (grid:number[][], start:Position) : number => {
    let queue:Node[] = [{cost:0, pos:start}]
    let costs:number[][] = getCostArray(grid.length);
    queue.push({cost:0, pos:start})
    let end:Position = [grid.length-1, grid[0].length-1]

    while (queue.length > 0) {
        const least = queue.shift()
        if (least === undefined) throw Error("no")
        const {cost, pos} = least;
        const [row,column] = pos

        costs[row][column] = cost

        if (_.isEqual(pos, end)) return cost;

        const neighbors = gridNeighbors4(grid, pos)
        const neighborsWithCost:Node[] = neighbors.map( ([r,c]) => {
            const costSoFar = costs[row][column] + grid[r][c] // the cost of going to r,c is the cost from here to risk[r,c]
            return {cost:costSoFar, pos:[r,c]};
        });

        queue = [...queue, ...neighborsWithCost] // add neighbors to queue
        queue = queue.filter(({pos:[r,c]}) => costs[r][c] === Number.MAX_SAFE_INTEGER ) // remove already-visited nodes
        queue = queue.sort((a,b)=>a.cost-b.cost) // sort (surprise: faster than scan-for-lowest of unsorted list... )
    }

    // no path to end means infinite cost
    return Number.MAX_VALUE
}

const getBigGrid = (grid:number[][]):number[][] => {
    const size = grid.length
    const newGrid = getCostArray(size*5)
    for (var ri = 0; ri < 5; ri++) {
        for (var ci = 0; ci<5; ci++) {
            for (var row = 0; row<size; row++) {
                for (var col = 0; col<size; col++) {
                    let newVal = ((grid[row][col] + ri+ci - 1) % 9) + 1 // yeesh
                    newGrid[ri*size + row][ci*size+col] = newVal
                }
            }
        }
    }

    for (var row = 0; row<size*5; row++) {
        for (var col = 0; col<size*5; col++) {
            if (newGrid[row][col]>9) console.log('bad init ',row,col,newGrid[row][col])
        }
    }

    return newGrid
}

test.skip('problem 2 sample grid multiplies out', () => {
    const bigGrid = getBigGrid([[8]])
    console.log(pretty(bigGrid))
})

test('Problem 1, Sample 1 ', () => {
    const totalCost = costOf(sampleInput, [0,0]);
    expect(totalCost).toBe(40)
})

test('Problem 1, Actual 1 is ...', () => {
    //NOT 392 - too high
    const totalCost = costOf(actualInput, [0,0]);
    console.log("Day 15, Problem 1", totalCost)
})

test('Problem 2, Sample is 315', () => {
    const bigGrid = getBigGrid(sampleInput);
    const totalCost = costOf(bigGrid, [0,0])
    expect(totalCost).toBe(315)
})

test.skip('Problem 2 actual is ...', () => {   // takes ~30s
    const bigGrid = getBigGrid(actualInput);
    const totalCost = costOf(bigGrid, [0,0])
    console.log("Day 15, Problem 2", totalCost)

})