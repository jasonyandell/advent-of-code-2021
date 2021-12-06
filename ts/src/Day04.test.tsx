import { isTemplateExpression } from 'typescript';
import {rawSampleInput, rawActualInput} from './Day04Input';

const readInput = (rawInput:string[]):{moves:number[], boards:string[][]} => {
    const moves = rawInput[0].split(',').map(entry=>+entry);

    let boardInput = rawInput.slice(1); 
    let boards = [];
    for(let i = 0; i < boardInput.length/6; i++) {
        const start = i*6+1;
        const board = boardInput.slice(start, start+5) // 6 lines including blank line
        boards.push(board);
    }

    return {moves, boards};
}

type BoardType = [rows:number[][], cols:number[][]];

const doMove = (move:number, board:BoardType) : BoardType => {
    const [rows,cols] = board;

    const filterAll = (all:number[][]) : number[][] => {
        const result = all.map(line => line.filter(entry=>entry!=move));
        return result;
    }

    return [filterAll(rows), filterAll(cols)];
}

const getBoardTypes = (board:string[]) : BoardType => {
    const rows = board.map(line => {
        const allMatches = line.match(/ *([0-9]+) +([0-9]+) +([0-9]+) +([0-9]+) +([0-9]+)/)
        const matches = allMatches?.slice(1).map(value => +value);
        return matches ?? [];
    })

    let cols = [];
    for(let colN=0; colN<5; colN++) {
        let col = [];
        for (let rowN=0; rowN<5; rowN++) {
            col.push(rows[rowN][colN]);
        }
        cols.push(col);
    }

    return [rows, cols];
}

const doBoardMoves = (moves:number[], boards:BoardType[]) : BoardType[] => {
    let boardTypes = [...boards];

    for (var i = 0; i < moves.length; i++) {
        boardTypes = boardTypes.map(board => doMove(moves[i], board));
    }

    return boardTypes;

}

const doMoves = (moves:number[], boards:string[][]) : BoardType[] => {
    let boardTypes = boards.map(getBoardTypes);
    return doBoardMoves(moves, boardTypes);
}

const getWinner = (boards:BoardType[]) : number => {
    const hasEmpty = (all:number[][]) : boolean => {
        const results = all.filter(entry => entry.length === 0);
        return (results.length > 0);
    }

    for(let i=0; i<boards.length; i++) {
        const [rows,cols] = boards[i];
        if (hasEmpty(rows) || hasEmpty(cols)) return i;
    }
    return -1;
}

const getScore = (board:BoardType) : number => {
    const [rows, cols] = board;
    const sum = (nums:number[]) : number => nums.reduce((prev,next) => prev+next,0);

    return Math.max(sum(rows.flat()), sum(cols.flat()));
}

const playTillWin = (allMoves:number[], rawBoards:string[][]) : number => {
    let moves:number[] = [];

    for(let i=0; i<allMoves.length; i++) {
        moves.push(allMoves[i]);
        const playedBoards = doMoves(moves, rawBoards);
        const winner = getWinner(playedBoards);
        if (winner > -1) {
            const winnerScore = getScore(playedBoards[winner]);
            return winnerScore * allMoves[i];
        }
    }

    return -1;
}

const playTillLastWin = (allMoves:number[], rawBoards:string[][]) : number => {
    let moves:number[] = [];
    let boards = rawBoards.map(getBoardTypes);
    let lastScore = -1;

    for(let i=0; i<allMoves.length; i++) {
        moves.push(allMoves[i]);

        let again = true;
        while (again) {
            const playedBoards = doBoardMoves(moves, [...boards]);
            const winner = getWinner(playedBoards);
            again = winner > -1;
            if (winner > -1) {
                again = true;
                const winnerScore = getScore(playedBoards[winner]);
                lastScore = winnerScore * allMoves[i];
                boards.splice(winner, 1);
            } 
        }
    }

    return lastScore;
}


test('sample input first move is 7 and last move is 1', () => {
    const {moves} = readInput(rawSampleInput);
    expect(moves[0]).toBe(7);
    expect(moves.slice(-1)[0]).toBe(1);
});

test('sample input to have 3 boards', () => {
    const {boards} = readInput(rawSampleInput);
    expect(boards.length).toBe(3);
});

test('check first and last characters', () => {
    const {boards} = readInput(rawSampleInput);
    expect(boards[0][0][0]).toBe('2');
    expect(boards[2][4][13]).toBe('7');
});

test('winner at 24', () => {
    const {moves, boards} = readInput(rawSampleInput);

    const submittedMoves = moves.slice(0, 12);
    const playedBoards = doMoves(submittedMoves, boards);
    const winnerBoard = getWinner(playedBoards);

    expect(winnerBoard).toBe(2);
})

test('sample winner board score is 188', () => {
    const {moves, boards} = readInput(rawSampleInput);

    const submittedMoves = moves.slice(0, 12);
    const playedBoards = doMoves(submittedMoves, boards);
    const winnerBoard = getWinner(playedBoards);
    const winnerScore = getScore(playedBoards[winnerBoard]);

    expect(winnerScore).toBe(188);
})

test('problem 1 sample output is 4512', () => {
    const {moves, boards} = readInput(rawSampleInput);
    const score = playTillWin(moves, boards);
    expect(score).toBe(4512);
});

test('real output is ...', () => {
    const {moves, boards} = readInput(rawActualInput);
    const score = playTillWin(moves, boards);
    console.log("Day 4, Problem 1 ", score);
});

test('problem 2 sample output is 1924', () => {
    const {moves, boards} = readInput(rawSampleInput);
    const score = playTillLastWin(moves, boards);
    expect(score).toBe(1924);
})

test('problem 2 actual output ...', () => {
    const {moves, boards} = readInput(rawActualInput);
    const score = playTillLastWin(moves, boards);
    console.log("Day 4, Problem 2 ", score);
})
