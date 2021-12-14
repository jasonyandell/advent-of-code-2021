export {}
import {copyGrid} from './grid'
import { sampleInput, actualInput } from './Day13Input'

const foldInHalfVertically = (grid:number[][]):number[][] => {
    const height = grid.length;
    const halfHeight = Math.floor(height/2)
    const width = grid[0].length;
    const newGrid = copyGrid(grid).filter((row,rowIndex) => rowIndex<halfHeight);
    for(let x = 0; x < width; x++) {
        for (let i = 0; i<halfHeight; i++) {
            newGrid[halfHeight-i-1][x] += grid[halfHeight+i+1][x]
        }
    }
    return newGrid;
}

const foldInHalfHorizontally = (grid:number[][]):number[][] => {
    const height = grid.length;
    const width = grid[0].length;
    const halfWidth = Math.floor(width/2)

    const newGrid = copyGrid(grid).map(row => row.filter((col,colIndex) => colIndex<halfWidth));

    for(let y = 0; y < height; y++) {
        for (let i = 0; i<halfWidth; i++) {
            newGrid[y][halfWidth-i-1] += grid[y][halfWidth+i+1]
        }
    }

    return newGrid;
}

const apply = (grid:number[][], instructions:string[]):number[][] => {
    instructions.forEach(indicator => {
        if (indicator === 'y') grid = foldInHalfVertically(grid)
        if (indicator === 'x') grid = foldInHalfHorizontally(grid)
    })
    return grid;
}

const problem1 = (grid:number[][], instructions:string[]) => {
    grid = apply(grid, instructions)
    const count = grid.flat().filter(x=>x>0).length;
    return count
}


export const prettyHashDot = (grid:number[][]):string => grid.map(row => row.reduce((p,col)=>p+(col===0?' ':'#'),"")).join("\n ")

test('Problem 1, Sample', () => {
    const count = problem1(sampleInput, ['y'])
    //    console.log(" "+prettyHashDot(grid))
    expect(count).toBe(17)

})

test('Problem 1 actual is...', () => {
    const count = problem1(actualInput, ['x'])
    console.log("Day 13, Problem 1", count)
})

test('Problem 2 actual is..', () => {
    const grid = apply(actualInput, 'xyxyxyxyxyyy'.split(''))
    console.log(" "+prettyHashDot(grid))
})