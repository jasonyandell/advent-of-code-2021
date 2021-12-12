import {gridNeighbors8, Position, getGrid, copyGrid, pretty} from './grid'

export {}

const simulate = (grid:number[][]) : [flashes:number, grid:number[][]] => {
    const newGrid = copyGrid(grid);
    let flashCount = 0;

    const flash = (pos:Position) => {
        const [row,col] = pos;
        if (newGrid[row][col] === 0) return;
        if (newGrid[row][col] > 9) {
            newGrid[row][col] = 0;
            flashCount++;
            const neighbors = gridNeighbors8(grid, [row,col])
            neighbors.forEach(([row,col])=>{
                if (newGrid[row][col]>0) newGrid[row][col]++;
                flash([row,col])
            });
        }
    }

    grid.forEach((row,rowPos) => row.forEach((col,colPos)=>newGrid[rowPos][colPos]++))
    grid.forEach((row,rowPos) => row.forEach((col,colPos)=>flash([rowPos,colPos])))

    return [flashCount,newGrid];
}

const simulateMany = (input:number[][], count:number) : [flashCount:number, grid:number[][]] => {
    let flashCount = 0;
    let grid = [...Array(count).keys()].reduce((grid,i)=>{
        const [newFlashCount,newGrid] = simulate(grid);
        flashCount += newFlashCount
        return newGrid;
    },input)
    return [flashCount, grid];
}


const firstFlash = (input:number[][]) : number => {
    let count = 0;
    let grid = input;

    const allFlashing = (grid:number[][]) : boolean => grid.every((row,rowPos) => row.every((col,colPos)=>grid[colPos][rowPos]===0))

    while (!allFlashing(grid)) {
        count++;
        grid = simulate(grid)[1];
    }

    return count;
}


test('problem 1, first sample matches', () => {
    const grid = getGrid(`11111
    19991
    19191
    19991
    11111`);

    const [flashCount, newGrid] = simulate(grid)

    const expectedGrid = getGrid(`34543
    40004
    50005
    40004
    34543`)

    expect(flashCount).toBe(9);
    expect(newGrid).toStrictEqual(expectedGrid)
})

test('problem 1, other sample', () => {
    const input = getGrid(`5483143223
    2745854711
    5264556173
    6141336146
    6357385478
    4167524645
    2176841721
    6882881134
    4846848554
    5283751526`);

    const [flashCount,grid] = simulateMany(input, 10)
    
    const expected = getGrid(`0481112976
    0031112009
    0041112504
    0081111406
    0099111306
    0093511233
    0442361130
    5532252350
    0532250600
    0032240000`);

    expect(flashCount).toBe(204);
    expect(grid).toStrictEqual(expected)
})

test('problem 1 answer is...', () => {
    const input = getGrid(`1443668646
    7686735716
    4261576231
    3361258654
    4852532611
    5587113732
    1224426757
    5155565133
    6488377862
    8267833811`);

    const [flashCount,grid] = simulateMany(input, 100)

    console.log('Day 11, Problem 1', flashCount, "\n",pretty(grid));
})


test('problem 2 sample', () => {
    const input = getGrid(`5483143223
    2745854711
    5264556173
    6141336146
    6357385478
    4167524645
    2176841721
    6882881134
    4846848554
    5283751526`);

    const iteration = firstFlash(input)
    
    expect(iteration).toBe(195);
})

test('problem 1 answer is...', () => {
    const input = getGrid(`1443668646
    7686735716
    4261576231
    3361258654
    4852532611
    5587113732
    1224426757
    5155565133
    6488377862
    8267833811`);

    const iteration = firstFlash(input)

    console.log('Day 11, Problem 2', iteration);
})
