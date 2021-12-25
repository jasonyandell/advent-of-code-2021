export {}

const iterate = (board:string[]) : string[] => {
    const doPass = (callback:(row:number, col:number, nextRow:number, nextCol:number)=>void) => {
        const height = rowPassBoard.length
        for (let row = 0; row<rowPassBoard.length; row++) {
            const width = rowPassBoard[row].length
            for (let col = 0; col < width; col++) {
                callback(row, col, (row+1) % height, (col+1) % width)
            }
        }
    }

    // horizontal
    const rowPassBoard = [...board.map(s => s.split(''))]
    doPass((row,col,nextRow,nextCol) => {
        if (board[row][col] !== '>') return;
        if (board[row][nextCol] !== '.') return;
        rowPassBoard[row][col] = '.'
        rowPassBoard[row][nextCol] = '>'
    })

    // vertical
    const colPassBoard = [...rowPassBoard.map(row => [...row])]
    doPass((row,col,nextRow,nextCol) => {
        if (rowPassBoard[row][col] !== 'v') return;
        if (rowPassBoard[nextRow][col] !== '.') return;
        colPassBoard[row][col] = '.'
        colPassBoard[nextRow][col] = 'v'
    })

    return colPassBoard.map(ss => ss.join(''))
}

const countTotal = (board:string[]) : number => {
    let oldBoardString = ''
    let newBoardString = ''
    let steps = 0
    while (true) {
        oldBoardString = newBoardString
        board = iterate(board)
        newBoardString = board.join('')
        steps++

        if (newBoardString === oldBoardString) break;

    }
    return steps;
}

const clean = (s:string):string[] => s.split('\n').map(s=>s.trim())

test('simple 1d example', () => {
    const result = iterate(['...>>>>>...'])
    expect(result).toStrictEqual(['...>>>>.>..'])
})

test('simple 2d example', () => {
    const result = iterate(clean(`..........
    .>v....v..
    .......>..
    ..........`))

    expect(result).toStrictEqual(clean(`..........
    .>........
    ..v....v>.
    ..........`))
})

test('sample 1', () => {
    const result = countTotal(clean(`v...>>.vv>
    .vv>>.vv..
    >>.>v>...v
    >>v>>.>.v.
    v>v.vv.v..
    >.>>..v...
    .vv..>.>v.
    v.v..>>v.v
    ....v..v.>`));

    expect(result).toBe(58)
})

test('problem 1', () => {
    const result = countTotal(clean(`>.>.>.>>>vvvv>>v...v>>.vv.v>>>>>>.v>....>>.v.v.>>....>.v>v>..vvv.v..vv..v>..v.>.v>v...>..v>>v.v......>vv...>>..v>.v>.....v.>.v.......>.>>.v
    .>>....>>.v.>.vv..vv.v>..>...v..>...v.v...>v.>>.vv..>...>>..>...v>....>...>>.>..>...>.v.>..>v>.>>v>...>.>..>.v.>..v>>vv>v.v>>vv.v..>>v>.vv.
    vv>.vv>>vv......v.....v..vv.v>....v>.>v>.>.vv>..>..vvvv>.v...>>v..vvvvv>>.v....v.>..v>>>....v...>.vv>...>v>.v.vvvv.>>..>>..>.>>.>v.v.>v>>>.
    v>.v.>>>>.v...v.vv>.>v>.v>v.>>v.v>>...v.v.v...vv.>vv>v>>.vv.v..v>>.v>.>..>.v.v..>v.v>...v..vv>.>vv...>.v>..>.>>..v..v..v>..v.v...v>.>vv.v..
    .>>>...v...v.vv>.....v.>vv>>.>>..>..v....vvvvv...v>.v.v.vv.vv...>...vv.v.>v..v>.>.v..v.v>v>...v...>.>.>>>..vv...>v>>.>>v.>..>.>v.v.v.vv.v.v
    >.>.>..v.v.>>..>..>..>v..>.>.v.>.v>>>v.v>v...>>vv.>>>>.vv...v>......v>v....vv..v>..>.v>..>.v>.>>..>.>v>v>v.v.>..>..>..v..>>...>.v>...v.v.vv
    >.>..>>.v..>>.v>v.v...>>v>v.>...>.v.>v........v..>>...>..>v.>v..v.vv..>v.>>vvv.>>>>>v>v.vv.>..>v>>>.vv.v>vv.v>...>>>...>..>..>.>v..v..vv>..
    >>.>>v>.v.......v.vv..v.v......v.v...>..>..>>>..v>...>.....vv..>>.>.vvvv>....>vv..>.>>v.........v.>>>>....>.>.>..v>...v.>...>.>>>..v.v>>.v>
    >v.vvvv.....>v.>.>>vv.v.v...>>.>.>v.v..>v..>v>>.>..>.>v.v..v>>.v>..>...v.v>vv>.vv>v.>v.v..>>.vvv>..>..>>v..v..>>.vv>..v.>.v.......>..vv..vv
    .>.>vv..>.>.>vvv.....vv>>....>.>>....v>vvv..>>v.vv>.>.>.v.vv.>....v>..>........v>v>.v....>v>>...vv.>..vv.>>.v..>.v>>.>>.v>.>.>vvv.vv..>..>.
    >>v..vv......>>v...vv.v.v.>>v......>>v.>..>.>vv>..>.v>>...v.>......v...>..>.>vvv..>v.....>v.>v..v......v..>...>>v>.v...>v>v.>>..>v.>.v.vv>.
    .vv>.>.>.v>..>>....>v>.>.>>>>.......v>v.v>....>>.v..v........>>.>>vvv>..v.vv..>.>....>>vv>v..v>>..>..v>.>>.>.>v.>.vv.>...>.vvv>>......>.>>>
    v.v...v.v...v>v.>>.v.>.>vv.v.....v.>>>>...>.>..v..v>....>.v>.vv>....vv.>>..v>vv>..>.v>.>v.....v.v>.>.......v..>vv....>.vvv.v..>>v>...v.v..v
    .>v>v.vvvv>.>vv.vv.vv.>v....>v>..>.v.>>..>>.>>>>.......>>>..v..>>...>>>.>vv>v..>...v..v..vv.vv...v....>...v>..>.>.>.>vv..>.>.>..>..v.v.....
    >.>...>>vvv.v..>...>....v...v...v..>v.....v.>v.v..>.v>>..>.vv...>...v..v>v...v...>.v.v>vv..>...........v.>>.v>>.>vvv.v.>>>>..>v>v>>>.>>..>.
    ..v>v..>>..v.>...v.....>...>..>>>v..vv>...v.v.v.v>>>.v.vvvv.v..>>.v.>v>..vv...>>>.>...>>v>.....v>.v.......v>.>v...>.vvv>>..>v...>..v..v>>vv
    .v.>v>vv...v...v...>.>...>.v.>>v>..>>.>>>v.>.v.>>.>..v.>vv>v..>vv>...>..>v....v.>>v....>.v.>>.v.vv>vv>.v.>>v.v>..>..vv.v>.v>v>v>..>.>...>>.
    .v>>>.v..>.v.>>.v.>>vvvv.>>v..vv..>v.>.>...vv>.v.v>v>v..>.>>.vv>...v>.....>>vv.>v.>.>..v...v..v.v.>>v.>....v..v>vv>v..>vvvv...>.>.....v.v.v
    >....vv.>.v.v>>>v....>..........v..>.v..v....v..>.v.>.vvv>vv>v.......>..>v......v>vv...>...>v>>>.>v.vv.v.v>>.v.v>.v.>.>.v.>v...v......vv...
    .v.v.>vv.>.v>.v..v.v.v.>>......>.v.>>.>>.v...v.>>>v.....>>>..>.v..>>..>.v>>.>v>..>...>.v...>>..vv.>>>>>>>>....>>...v.vvv>>..>>.>..>>v.v.vvv
    .v...>.>>..v>>>v.v.....>.v>.>>>>...>>..v.>.v.........>v>..v..v>v>...v>v>...v....>..v>.>...v>vv>>>...v..>.vv.>v...>.>..........vvv.>vv.>.>vv
    >>>>vvv>>v.>.vv>v>v....v>.v>...v>>vv..>v...>>.v.>....>.v.v>.vv...vv....vv....>..v>.v..vvv...>>.vvv.>.vvv.>.>>..v..>>.v..>>.>v>v>>...>.v.vv.
    >.v>.>v.v.>.v...>...>>.>...>v.v.vv..>.>v.>vv>.v>...v>.>...v.>>..>v>>>>.>>.>>v..>.vv..>.>..>v.>.v>>>....>.>..vv.v>vv>.>...>>.v..>>...vv.v..v
    v.>v>..>v..>>..>.>>.v.vv.vv.>.>>v>.v>vv.>vv.>vv..>.v...>>.vv...v..v.>.v.>.....>v...>..>.....>.>>v.......v...v.v.>.>...v.>......>.>...>>.>.v
    >vv>..v>v>v>.>>v>...vv...>>>vv.>.vvvv..>.v.>>v>vv.>..>>..>v.>..v.v..>v..>>v..>...>.>.>..v...vv.>v.vv....>>v.v>....>...>.v..>v.v.v...>>>>.>>
    .vv.v...v>vvv.v>...>v....>..vvv.vvv.v.>>v...>>>.>..v....v>>>v....vv.v>.>..v..>.....>..>>..vvv>>vv...v..>.v>>...v>v.v.v.>v.v.v>>..vv..>.v..>
    .>..v....v....v>>.>..v>.>>..v>>>.>v..vv.v>vv..v.v>.v.v...v>>...>>vv>>vvv.>.v.>v..vv>>...vv.......v..>vvvv>>.>...>.v>>vv..>...v....v.....>..
    >>>v.>>>>>.v.vv>...>..>>>.>....>v>>....v..>..>v.>>.v>.vv....>...>.>..>..v...>>v...v....>v.....>>.>.>>>.>>.>..>>.>>>>>.>v.v>>vv>>.>>>.>vv...
    v>...v.>v>v>>.vv.>v.>v....v>.>v..>...>>>v....>..>...>.vv>>.>...>vvv...vv.v.>v......>.v>vv.v.vvv>>..v>>.v>.v..vvv.v.v.>>.>>v.>.v.>.>>v..v.vv
    >>.>..vv>>..v>vv>>>v..>..>...>..>v.>...>>>..v..v.>vv>.>.....v.v>.>>.v>v.>..>.v...v>..v>........>>.vv...>.v..>>v>v..v.>v>>>...>.>>..>.vv>v..
    >v>v....v..>...>....>....>..>...>..v>v...v..v....>.....>.v..v....v.v..vv......vv.>vvv>..vv>v..v>v.v>v>.>....v...>>>>>..>..>.v..v..v...>vv.>
    .v.>v..>..vv.v.>.v.>>>v.vvv....v>....v.v.v..v....v...v>v..v...>v.>v..>.v>..>>..>v>.vv.v..>.>>v>.>..>>>v.v...>.>....>..>..>v.......>v>v.>.>.
    vv.>..>v>>.>.............>.>v>..vv>.vv>..>>.>..>....v>>v....vv>....v>.>.v.v.v>....v.>.vvvv>vv.v>.>v>vv>>..v..>>...v>..>>..>>..v.v..v...>vv>
    >.>.>..>>...v.vv.....v..v..>...v.v..>>.....v>>...v>..vv..>>.v.>>>v.>...v.v.......vv.vv...>>...>>v>..>.>vvvv..>v....vv>.v>>v..vv.v>>vv.>v>.v
    ..vv..>..v..v.>.>.vvv..vv..>..v>v.v.>.vvv>vv.>.......>>>vv>>...>v.v.>>vvv..>..v.>v..>vv>v.vv........v>.>....v.>.....>.>>v.vvvv..v.>..>..v.v
    ...v.vv>>.v>..>.>>vv..>.v>>..>vvvv.v..>.v.>>....>.>..>>.v>...>vv...v.>>vv..v..>vv>.>.v>.vvv>>.>.v.v...>...>v.>.......v.>.v>.>.v.>.>.>.>.v>.
    vvvv.>v>.>>..>...vv...v>.v>>.>.v>.>vv...v..>..v.v>>v>.vv.......>...>v>v.v.v>>...>.>v>.v...>.>.>>..>vvv>>...v.v..>v..v>..v.>v.v.>.v.v.>v.v.v
    >.>...v..>..vv.vv.>.v>..v>v.v.v.v.>...v>v..>v.v>v>v>.>.....v.v.>..v..v.v.vv.>>>.vvvvvv.>......v>>>v.v>v....vvv>.>.>.>v..>..>v.>..v.....v>v.
    v.v.v...>.>..>.v>..v.v.vv..>.>.>..>>....v>>..>.>v....vv..v...>>v.>....>..v>.v.v.>.>......>v>v.v..>.>>.>v>...>...>vv........>vvvv.>v>>...v..
    .v....>vv.vv.>v.>.vv>..v.>...>v...>vv>..vvv>.v...v.>..>v>>v...vv.vv....>>.>..>v>..>>...vv..v>.>.v..vv.>.v..v..>.v.>>..>>v.v..vv.v.v.v.v.>v.
    >>...>v......v..>.>.v.vv>>.>...>v.....>v.vv>.>.....>vv>.>...>vvv>..>>.>....>>.vv.v.>v>v.v....vv....>...>>...>...v>.>..v.>.vv.>vv>>vv.v.....
    .>.>..v....>.>.>v.>v>..vv..vvv......>v..v..>>>.>v>>>...v.>.v>vvvv.v.>>...v.>v.v>..v.>vvv.v...v>...v.v>v.>.>.>v..>v.>.>vv.>vv>>>.>>>>v>v..v>
    v..>..>.v>...v......vv>...>v..>.v>...v.v>...>.>>.v>...>...v..>>...>..>..>>..vv.v.>v.>>>..>>>>..>>.>..>.>>..v.v>.....v.v>v>>vv.vvvvvv....>v.
    ..v..v>v....>...vv>v....v>v...>>.v.vv.>>v.vv.>vvv.......>..v.v>>>..>..>>......>>......v......v..v....v...vv..>>.v.>......v.>>...v>..v>>v>vv
    vv..v...>>.v>.>.v...vv>>..v...>.v...v..vv>>..>..v>.v>vvv>v.>.vv.v..>.v..>>........>.>.>.>vv...>..v..>v.v>.vvv....>....v>..>>v>>vv>.>..>v...
    .>>>.>.>>.vv.v....vv.v.>>.....v.v>...v>>>.vvvv.vv.>.v>v.vv.vv>>.vv..v.>>.vv>>vv>.v..v.>v.>....vv>....>v.....v.>..>..>v.>.>..v>>.v>.>>vvvvv.
    v>>..vv>.>.....>vv.v..vv.>>.>>...v..>....>.vv.>>...v.>v>....vv>>....v>...v.>..v>.....v..>.v.vvvv.v..v>>.v....>.v>.>>..vv.>v>..v>.......vvv.
    .vvv>...>v>..>>...>.....>...v..v.>>>.v>.v..v>>>>..>..vvv>.v..>v...v>v.>.>.>.>.>.>>..v.>.v..vvv>v>.............v.>.v.v.v...v.v.>v...v.>.v>..
    >..vv>...v.>>....v..v..vv..>>.....>v..>.....v>.v..v.>.v>.v>vv.v.v>.>.>.>>.vv>v>.v>.>......v>v..v>v.v.>>v>.>v.v>v.v>>>v>..vvv>>.v.v>>>v....>
    .v.....>v>>....v..v>v...>v.....v.v.>..v>v>v>>>..>.>v...v..>v.v...vv..>....>v.>>>v..v.v>vvvvv>v>...v...>>..v.v.v>vvv>v.>v>.>v.v...>.....v..>
    >.v.>.vv.>v.v>>>v...v>>>.>...>vv..>.v>.v.v...v.>....>.vv.v..>>.>....v...>....>.>>>v..vvvv.>vv.vv.>>>>..v>v>..>v>.v.>...>..>.>.vv.>>.vv>.vvv
    .v.>v>v>....v.vv.>v.>...v>.>>.......>>.v.>v>.>vvvv>>vvv.v>>v.v.>.>.vvv>.>v....v...v.>v.vv...>>>vv..vv..vv...>..>>.v....vv>>>v..v.v......vv.
    vv..>..v.>.v.>v..>..vv.>...v.>vvvv>v.>vvv.>.>..vv.>.>.>...v..>..>v..>...v>.>v>.v.v>>..>..vv>.v....vvv>.>.>>.>>..>v>>.v>.v.>>..>>v.>>.v...v.
    v>>>v>..vv.>>..v>.....>vvv.>>..>.>>.>v.>vv.>.v.v...v....>>.>..v.>v..v>...>.v...v.>>.>v.v.v.>vv>...>............vv>>>v>v>...>v>>.vv.>v...>>.
    v.v....v>vv..>..v...>....>>>..vv>...v..v>>v...v.>v..>..v..>.>....v.>vv>..v>.>.vvv>..v>>.v.v>.>..v.>v..>....>.>>v>vv.....>...v...v....>>.vv.
    ...>.>>>>v.v.v..>>....v>.v..v>v...>>vvv.v>v..v>vv...>.v>.v>.>.v>...v.>.vv>..>....>..>>vvv.v....v.v>>>v.>>>>.>v.v.>>.>>...v..v.>...v.v>.>>..
    >....v..>....v.vv.>.v>v.>.vv..vv..>.v.>v>.>>>..>..v...>vv>vv>>v.>..v>>.vv.v.v..v>>.v.>.>...>.>..v.>.>......>.v.v>>.>.>>..v...v>.v.>>v..>>v.
    vvv.>......v.>v....v>v...>.....v..vv..>>v>.v..v...v.>.>>..v.v..v>..>.>vv.v>>>vv>..v.vv......v.v.>v.v..v..>..vv.v.v>>>....>..v.>v>...>.>....
    .v.>.v>>..>....vv>v>vvvv.v.>.>>...>.>.v.>v..>>v..v>.>..>.vv..vvv>v.>..>..v....>v..v.....v>>>..>.v..>vv...v.v....>vv>..v.>v>.>vv>v>v>>v>>>.v
    >vv.>..v>>v>v.v>.v..v.v>v>.v>.>.....vv>>>>...v..>vv>.v>>v.>.>....>...>...v>>.v.v.>...v.v>v..v>>...v>>>...>...v.>v.>>..>v.v>..>>>vvv..v>.>..
    v>>>>.>.v.>v.v....>....>...>.>.....>.v..v>.>v>.>>v.v>...v..>>>.vv...>..v..>>..v....>v....>v.>vv>v...v>.vv>.v>v>..v.v.vv..v...v..>>..>v>.vv.
    v.vv.>.v.....v...v.v...vv.v...v>..v.>....>.v>.>>vvv>.>.v>...>.vv>v...vv.v..>vvv...v.>..v.>.>>>.vv>v.vv.vv>v>v>>vv>v.>>vv..>..vv...>v.v>>..v
    ...>>vv>>>>vv.>>v>v>.v>.v..v...>>..v>...v>>vv>.>.>.>>..>....>vv.v.vv.vv>.>v..v.>..v.>.vvv..>..v...v>>v>..v>>v...v..>>...>>vv>.v...v>.vvv...
    ...vv.>>.v...>>..>v>..v.v>..vvv>v.>>>v.v>.>...vv....>>>.v.>>>>v.v>vv>>....>>.>..v>vv>....v.>.>v...>.>v.>v>.v..>>..>v>v>..>..>v.>...>....vv>
    ...v>.v..>v.v......v>>>........v.v>v..vvvvv>..>.vvvvv>>>.vv.vv>v...vv..>v>v.>.v>.>....v.>..v>..v..>>vv>>......>............>>>vv....v>v.>.>
    ..>...>....vvv.v......v.>>>.....v.v.>...v.>v....v...v>..>>>..>..vv>>v.v>.>.vv.vv.>.v.>v>v>>.>>v..>......v..vvv.>>....v>v.>>vv>>..>..v>>>.>v
    .v>.....>v...v.v>..v>..>....v...>..vvv>...vv.>v.>...v>.v.v>....v...>>.v>>v...>>.>.v.v.v>v.vv>v.v.v..>>.v.>>.....>>>...vv.v>....>.>.>v.>v>.>
    >..>v.v.v>..>vvv....v....v>v.>...vv.>v>....vvv.....v>.vv..>..>>>v>v>v.>v.v>...v.>...vv.>....>>...>.v..vv>v>.vv.v....v>v>v>.>>.>>.>>vv...vv.
    vv>........v>v>.v.v>....v.vv.vv......>.>>v..>>>.>.>v...vv.....>>>.>.v.v...>.v.v..>.>.v.v.....>.vvv>>.v.>>.........vv.v..v>v>v>.v>>..vv.v...
    .>>.vv.v>>.>>.>>..vv...v.v>v.>.v>>.vv..v...>...v...vvv>>.v...v.v>>>v...v..v...>>..v.>>v.vvv>...v.........v.vv>..v.v..>..>.>v>.>.>>..>v..>..
    .v.v..v.vv>v.v...v..v>v>.>v.v>v....>....>v.v.>>..>>v>>.v..v>v.>>.>v.>..v....v>..>..>.v>..>v..v.....>.vv..>.......v>....vv..>v..>>v..>v....v
    v.vv.v.>v.>v.>...v.v...v..>..v..>>.vv.v.>.>...>>.>v>........>>v...>.>v...>..v.>>v.>...>..>..v>>vvv>.....>vv>....>......>>>vv>.>>..>>>..vv.v
    >vvv>v>vvv..v..v..>>.v>vv>......>>v.v>.>.>vv.>.vv..v..>.v>.....>v.>....>>v.vv.>>.v...vvv....v>>>..>..>.v.vv.v>v.....vv>..>.>.>>..v..>.>..v>
    .>....v>...>>>>........v..vv>v..v..v....v>>..v.vv...>.>.>..>.....>v>.v.v>v...>vv.>..vv..v>v>>v.>>.v..v>.vv>.v....v>v>..>...>..v..>..v..>>..
    .>.>v>.>v>..>vvvv.v.v.>.v.v.>>...>vvv.vv..>>>.v>.>.v..>v..vvv>...>v>.>v.>>v>v>..>v........>v.vv.>>...v.v..vv.>...>..>..v..v...v.v.v.>.>vv..
    ............>v....v.vv>>v..>...>.>>>..v>.v.vv....>.>>>>v>...>v.v.>v.v.v>.>...>>.....v....>.>...v..v..>..>>.>..v>>v.v..>.>vv>v.>..vv.vv..>v>
    .>..vvvv>vv.>.>>v.>.>>vv>vv>..>>v>.>...>>v>v..>>.>v..v.v>>.v>....>v>.v.>>>.v.v..>>.v>>.v...v.vv.v.>..v>..>...v..v..vv>.v....>.>>....v...v>>
    v.v>vv>....v..v>>.>v.v.vv>>vv>>.>>..>>vv>..v..v>.>......v..v.....>v...vvv.v...>.vv>...>.v..vv...v>....v>v..v.v>.v...vv...>.v..vv.v>.>v>>.v.
    >...v.>>v>..>.>..v.>vv.v...v>..>>...v>>vv..v.>.>v..>...v.....v>.>..v>>...v>>>.>..vvv.v>.>>.v>.v.v.>v>vv.vv>.v.v..........v>>..v...>..>>>>>.
    v.>>.vv....>.....vv>.>.>>>.v.>.>>..vv..v.v.>...>.>>...vvvv..v.>....v.vvv.v.>v....v>..>>vv.v.>>..>>.v>.>v.v...v..>.>.vv>.....v.>.vvvv>>vv.>.
    >.>v>..vv..>..>>v...v>...v.v..vv>.....>.>...>v.>..>...v>v....v.v..>>v...>...vvvv.>v..v>..vv.>...>>.v...>>..>..>v.>>>>>....>.v..vv>vv.v.>.>v
    >...>v.>>>v>v>>v.v.>v..>.vvv.vv>>.vv>...>>.v...>.>>>...>....v.......>.>.vv>v.v.>>..v>..v>vv>...>.v>vv...vv.v>...>.>>v.v>v.v.>.>..vv....>...
    vv.vv...>..>vvv...>v.vvv>.v.vvv...>.v>.v....>v>>>.v....vv....>..>vv>.>....>.>>vvv.>....>....>>...>v..>v>>v>>v.>v.>..>..v>>v....>......v.v>.
    .>v..v..>.>..v..>.....v>...vv>.vvvv..>..>v..v>>.>..>.>.>..>>...v>>.v.v.>v.>...v..v.>v.vv.>vv.>..v.>v>.>.>.....v.....>.....>>>v.>.>>.v>.v>>.
    vv.>....vv...>v.v>.v>>..v.....vv>..v>>.>..>.v...v..v.....v>>>.vv>>..>..vv.>>....v..>....vv>>>..>vvv..vvv>v>.>v..>>.v.v>.v....v.>>..>....>v>
    .....>...>.>..vv>....v.v.>v..v.vv...>.vv.v>>>.>>..>v>...v..>.>v.>>.....vv.>v.>>.v>....v>>..........>.>v..v.>vvv.v.v>.v>.v>>.>.>>.vv.>>.v>v.
    ...v.v...v.v.v>v>.vv.>>.vvv>>.v>v.vv.>.>....v...v...>>>>>>>>v....vv>.>.>>>..vv.>....>>.....vv>......>.>>.......v.>>>>>.>>.>v.v......v..v>.v
    ...>vv>..v.>v>vv>.>vv>...>...vv>>.>.v>..v....>vv.>.v.>>v.>>.>...v.vv..v..>.vvv.v>v.>.>.v>.>v.v.vvvvv>>.>>..v>....>.v.v......v....vv..v.vv..
    >vv>.v..vvv>>....>v>..v>...v.>.>vvv..v......>vv>..v.v.>>....>...v....>..vv.v.>>>v.v.>>..>.>vv>>..v>.vv..v>>v.vv>.v>.v.v.v>..>.>.vv.v>v>.>.>
    >.vv...v..>..v.....>v>>.>.>v>...>>..v>....>>..v>....v.>.v...>>vvv>...>>..v..v>vv.v>v.>....vv>v.>..v.v>v...>>.v.vv..v...v.v.>.v>.>..>.>vvv..
    >>v>v.>.>vv..v.>vv..v.....>v..>v...v.>v.>>.>>>.v.>vvvv..vvv..v>>.>...>>.>..>.>...>v...>...>v.vvv>......>v....>.>>.v.>.>>v....v.>.....vvv>v.
    ...>>v..v>v.>.>......v>.>>.>vvv..>>.vvv.>.v>..>v.v.>>.>.>..v.>..>v.>>.v.>>.>>>v.>..vv..v>v.......>v>..>..vv>v.>.>....>>....v...v...>vv..v.>
    .v>.>>....>>>v>>>..>..v..>...v>v>..>.v.>....v..v.v..>vv>>.v.vv.vv.>>.vv.v.v.>>>>....>.>...>>...v>.v>.vv....v>>>.v>v.>.vvv>..v...vvv>>.vv.v.
    v..v..>..v.>>....v.v>.>..v>..>>>>..v>..v.>.>>>v>vv>.v>.>>>..>>v>>.>.v..v....>..v>>v.....vvv.v>.vv..>...vv.>>.>.>.v..v>>v.v...>..>>...>v..v.
    >>.>v>v..>>...v>.>vv.v>.>.>>.v...v.>>v>>>.v>....v..>..>..vvvv>...vv.>...vv...>.v.>v>>>>v>..>>...>>v..v>>>v..>..>vv>.v..v.v.>.>>v.vvvv..v.>>
    .>v.vvv...vv.vv.>>.>....>..>vv>..>.v.....>.>v>>>..>>v..vv....>>.......>>>v.vvv>>.......>.>vvv>.v>>....vvv..>vvvv.>>v..>.....>..>.>.>.>v.>>.
    >.v....v>.>.>..>.>.>..>v.>...>....>>>v.....>>..v>>>.v>>..>.>v...v.>...>.>v>..>.vv>.>v>>.>.>>...vv>.>>.vvvv.v..v.....>>>vv...>>.v>v..v>v....
    .v.v.>..v.>..>.v.>v.v.v.>.vv>v..>>v>.vv>.vv......>v...v>..v>..>>.>v>.>.>v.>>.>v.v...>>.v..vv>>.>...>.>..v>.v....v..>...v..>>.v...v.vv>vvv.>
    ..>.v>..v>>v>>v>v>>.>>.>.>.v>..v>.>vv.>v..>.v>>.....>...>>v.>v..v..v...>.>....v...>v..v.>>.v>....>.v....>.>.v.v..>.....v>..v...v>.v>v.v.>..
    v.>.vv...>vv.>v.>.>v.>>>.v>>v..>>>..v..>..v.>>..>....>v>v>vv..v>vv>.v....>..>>v.>>>..>>>>..>.v..v..>v..>.vv>.v>>>.v........vvv.>..v>>...v..
    v.>>>.>....>.>.v>v..>..v.>.>v..>v>.v>v.>v.>.vvv>v..>.>>>>.>>>....>...>..vv..vvv..>.v.v>.>vv>...v...vvv.>..v>v>.>.>...v.>.vv.vv.v.v>.....>.>
    v..>....v>.vv.>>...>vv..>..>>>.v.v.>>>>v..>v>v>v>vv.>...>>>v>.>v>.>..>vv...v.v>vv.>...>..>>..>.v>v...>..v>....vv>...>.>v.v.vv>v.>vv..>>.>..
    ...v..>v....>>.>>.>vv.....v>.>.vv>.v.>.v>v.>..vv...v.v.>...v.vvv....v>vv...>...>.........>.>...v.v.>.v.vv.vv.>.>...>vvvv>v..>....>>>>.v.>>>
    v>>.>>vvv.....v.v>..v.>>..v..>vvv....vv>......v.>....v>v.>v.v...v...v>vv...v.>.>>..v.>v.>>v>.vv.>>v.v...v.....v>>v.v>>....>>.v>...vvvv.v.vv
    ..v>vv>>>>>.v>>vv..vvvv..v>>v.>v.v>.v>>......>...>.vv..>>...>.v>v..>vv..>.v..v....>.v..>>v>v...>.v...>.v>>v..vvv.>v>..>...>v.>..v>.>v>>>>>.
    >.>vv..v...v>>>vv.>>v..>....v>>v.>.....v......vvv..v....>>v>....>..v....>>>>..>v..>..>.v>...>..v.v.>v>>v.v>>>...>...>v....v..>.>v>>>.vv..>.
    .>.>..vv>.v>vv.>>..v.>>>>..v..>.v>>..>>.>....>....v..>..>>>v>.vvv.>v.>>>>.>>.v>v>>>..>......>>...v>vvv..>..>..>.v.vv>.>vvvv>vv.>v>vv.>.vv>v
    v>.>.>v..v>v.>....v..v.v>...v.>.vv...>..>..>..>.v.>...v.>....>.>..>..vv>.>>.>.v>..v...>>..>>..>.>..vv>.v>vv.>.....v.>.....v.>.>v..v...>..>>
    ..v>>....v>....>v.v.v.>..v>.vv.v>.......v.>>..>...>>>.>...>..v.vv.>>>vvv.>....>.>.>>..vv....>>>..v..vvv..>>.....>>>v..v.v..>.vv.v.v.vv.v..v
    >.v.v...>.v..v>>...>.vvv>>..v...v..v.v..>>.vv>>v>v...>..v>.vv..vv.vvv.v.>v..v.>>>v.v>vv..v.>>v.>>v.>>v..>.v.>.....>>v..>v.>...>....>>vv>.v.
    .vv>..>>>.>..>..>>>v>v>..v..v.>.>v..v.v.>..v...v>>...v>>.v>.>>.>v.>>v>>.>.>.>v.>.>vv...v.>>>>.vv...>>>..>.v..v.vv>>...>.....vv.>>vv.....v..
    >..>v.>..>>>vvvv...vv...>v....v..>.v...v>v...>>vv>v....vv.>..vv..>.>>vv.v.>>....v>v..v.v>v>..v>.v.>.>...>.>.>..vv.>>.>>>>.v..vv.....>>.v...
    vv..v.>.>>vv>v>..>..v.v....v..v>........>.>..>.........>..>v>.v.>>....>>>.>vv.v..>......v.>v>>...v.>.>.>.>v>..>..>...v>>.>>.v..>...>v.v.v.>
    v>..vv.>>>.vv.......>.v.>...>..>>..vv..>.v..>v..v>.v>.>.v>v.>>v..>..>>.......>v.....v.v....vv.v>......v.v>v...vvv...vvvv..>v.v..v.v...>v.>>
    >..>v>.........>v...>v..>..v.>vv>.v>v>>.vv.v>..v..v>.v.vv..>>vv..v.>>>v>..vv...v..v>vv......>>..v..>.>..v>..>v...>...v.v>...>...v>>>.v.>>..
    .....>...v..v..>..v.....>..>>.....vv.....>..v>..vv>.>.vvv.vv>.....v.>.v.v.v.>>v....v.vv>v.v>..vv>.>.v>>>...>.>.>..>v....vv>.>..v.>.vv>>v>>v
    ..v.........>.v...>..>.v.v.>v..vv...v....vv.v.>.v...vv.....>..>>>.>..v>..>.>>v.>...>..>....v>..v.>>>..>.v>vv>v>.>....vv.v....v>.vv>.v>>.>.>
    .v..v..v>...v.>...v..v......v.>>.>.>v..v>.vv.......v..v>v..>>>...>v...v...>v.vv.>>.>.>...>.v.v>>.>.>>v>>.>..vv.v...>>v...>>>.>....>>>.v>v>.
    v>.v..v.v>vvv.v..vvv.>...vvv.vvvvv>>.vv.>>>.v..v.>.....v>vvvv...v>...>...>v.v>.....vv>v>v.v>>.v..v.v...>v...>v>..vv>.>>..v...>>v>.>.vv..vv.
    .vvv..v>....v.v>>.>...>v.vv...>>...vvvv.....vv>.....>..>.v.>.>.v.>>>v>v>.>>v...v>v>vvv>v>v>v.v>>.....>.v>vv.>>.>.v..>.>.....v.v>>......>.>.
    .vv.>.>.v.v>.v>vv>>v.>>.>.vvv>v..v.vv>..v>v..v>>>>>.....>..>..v>v.v......v>.v...vv>v.>..v>.>.v>..vv..>>>....>>.>.>v...v.>>.>>..>v>.v..v.v>.
    .v...>.vv>>>..v.>>.v..>>.>..v.>.>..v>>...>>...vvvvv>v..>>vvv..v.>v>......>>v>.v..v....>.>>....>>..>.>v...vv...>.v>>..>>.>....v....vv...>v..
    >...>>>..>v.......v..>>>v.>>....>>.v.>>v.v>.v...v...>..>v.vvv....v.>.v>..>vvv..>..>..>vv>..vv..>>..>.v.>>v.>.>>.v>....v.>...>v...>.>..>...>
    vv>...>....v..>.>..>>......>vv.v.v.>v.v.v>.>.v>.>vv.v..v>v>...>>..>....v...>v.>.v.>v.>v..>>.vvv.vvvvvv...v.vvv.vvvv.>>..vv>vv....vv.v.>>...
    ...>...v.>.>..v..>vv..vv>v>....vv.vv>.v....vv>.>>...v>>>..>..vv.v..v.vv.>vv>v.>v.v.>.>.v>v.v.........v>...>v.>>..v..vv>>>.v>.v.v.>.v>v>..>>
    ..>..>>...>>..v>vv>..>>>v.....v..v...vv....v>.....>.v...vv...>...>..>....v.vv.>v..>v....>>..>v.>vvv>v..v>...>....v>v>>v.v..vv>>.v...v>....v
    .v..>...vvv.>...v..vvvvvvv.>v......vvv>v..v..v..>>v>v.v.vv....v>>..>>v.>.v.>...vv..>..>.v.v.>v>>>...>>>v..v.v.v..v>.v.>.>..>>...v..v>>>vv..
    >vv..v>vvv>.>.vv...v..>.vvv..>>>....vv>..v.>.........>v>...>.v..vvv..>v..>.......v..>v..v..v>.>.v>>>vv...>>..>...vv>>>..>>..>.vv..vv>...>..
    .v>vv.v..v>>>>v..v.vv>..>>>..>..>.>....>..>..v.v>....>.>v..>v.>vvv..>..>..>v....>...>..>..>.>>.vvv.v.v...v.>...v>.>v.>>vvvv.v....>v.>.v..vv
    v>v.vvvv..v>vv.>v.>>.>.>>>>>v>.v>...vv>.vv.>vv>.v..>v.>>>>vv>.>>..>v.>.vvv.>>>.v>....vvv>.>..v.v..>.v>v.>..v.>.v>v..>..v>v>.>v..>v.>v...v.>
    v>v..vv.vvv...>v>v.>>.v..>.>...>v.v>>>v....>>.>>v.vvvvv.vvv.>...>..>v..>>.v.vv...v>..>>>v.....>.>..>>.........>..v.v>..v..>>..v>.>vv>.>v...
    ...>.>.>.vv.>v..v.v.>>...v.>>....>.>.v...>..v.v..v..>vv>.>v...v>v>..>>v..vvvvv>>v.v....>v.v.>....>.>.>...v...v...v>v....v>.v.v.>>>v>>...>.v
    ...>>v>v.vvvv.>>>.>>>....>v>v..vvvv.v..>vvv.....>.>...v....v.vv>...v>v>>>>....v>>.>.....vv>>.v.>v.vv.>>>vv..v>>..v>...>..vv.v>v...>>.v....v
    .vvv>v....>v>.>vv>.vv>>..v...>....v.>>>>>..v.>v.>.v>>.v..vv>..v....>...v.>v.>>..>.vvv.....>>..v>.>...v>v>v.vv.v.>.........v>>v...>.>>v.v>.v
    >v.>vv.>.v.>.v..>>.>v....>v....vvvvv>.>vv>v.vvvv..>>>.>>v>.>.>v>v......v>>..>>...>>...>>vv.>.v.>...v>..v.>>>.....vv.>v.v>.>vv>...v>vv>.v>>.
    >..>...>vv..vv.v...vvvv..>v..>.v.>.v>..>v..>......vv...>v....>.vv>vv...>v.v..>..v>.........>>>>>........>......>.vv>....>>>.>>.>v.>..v.>>.v
    .>..v>v.v.vv.>..vv...>.>..>.v>.v..>>.v..>v.vv>>...>v>v.v..>v>.v.>..v.>...>.>>.v>.v.>....>v>..>>......vv.v..>vvvvv.>>v>vv>..v>.>v>.>v...>.vv`))
    console.log('Day 25, Problem 1', result)
})
