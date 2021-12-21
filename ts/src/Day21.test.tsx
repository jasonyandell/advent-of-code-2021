export {}

const playGame = (positions:number[]) : [number, number] => {
    let currentPlayer = 0
    let dieValue = 0;
    const scores = [0,0]

    const roll = () => ++dieValue
    const moveForward = (spaces:number) => positions[currentPlayer] = ((positions[currentPlayer] + spaces) - 1) % 10 + 1
    const calculateScore = () => scores[currentPlayer] += positions[currentPlayer] // increase score of current player by their current position
    const gameOver = ():boolean => scores[currentPlayer] >= 1000
    const nextPlayer = () => currentPlayer = (currentPlayer + 1) % 2

    while (true) {
        moveForward(roll() + roll() + roll())
        calculateScore()
        if (gameOver()) break;
        nextPlayer()
    }

    const losingPlayer = scores.findIndex(s => s<1000);
    const losingPlayerScore = scores[losingPlayer]
    const dieRolls = dieValue

    return [losingPlayerScore, dieRolls]
}

type GameState = {
    positions:[number,number],
    scores:[number,number],
    currentPlayer:number
}

const countWins = (positions:[number,number], scores:[number,number] = [0,0], currentPlayer:number=0):bigint => {
    const zero = BigInt(0)
    const one = BigInt(1)

    let outcomes = new Map<string, [bigint,bigint]>()

    const key = (state:GameState) : string => "" + state.currentPlayer + "->" + state.positions[0] + "," + state.positions[1]+ "," + state.scores[0] + "," + state.scores[1]
    const hasOutcome = (state:GameState) : boolean => outcomes.has(key(state))
    const knownOutcomes = (state:GameState):[bigint,bigint] => {
        const k = key(state)
        const outcome = outcomes.get(k)
        if (outcome === undefined) throw Error(`no key at ${k}`)
        return outcome;
    }
    const setOutcome = (state:GameState, outcome:[bigint,bigint]) => outcomes = outcomes.set(key(state), outcome);

    const roll = (state:GameState, value:number) : GameState => {
        const newPositions:[number,number] = [...state.positions]
        newPositions[state.currentPlayer] = (newPositions[state.currentPlayer] + value - 1) % 10 + 1

        const newScores:[number,number] = [...state.scores]
        newScores[state.currentPlayer] = state.scores[state.currentPlayer] + newPositions[state.currentPlayer]

        const newPlayer = (state.currentPlayer + 1) % 2
        return {
            positions:newPositions,
            scores:newScores,
            currentPlayer:newPlayer
        }
    }

    const getValues = () => {
        let values = []
        for (let i = 1; i<=3; i++)
            for (let j=1; j<=3; j++)
                for (let k=1; k<=3; k++)
                    values.push(i+j+k)
        return values;
    }

    const values = getValues()

    const maxScore = 21
    const learnOutcome = (state:GameState, d:number=0) : [bigint,bigint] => {
        //console.log(d, state)
        if (d>1000) throw Error("no")

        if (hasOutcome(state)) return knownOutcomes(state)

        if (state.scores[0] >= maxScore && state.scores[1] >= maxScore)
        {
            console.log("no", state)
            throw Error("no")
        }

        if (state.scores[0] >= maxScore) {
            var result:[bigint,bigint] = [one,zero]// state.currentPlayer === 0 ? [zero,one] : [one,zero]
            setOutcome(state, result)
            return result;
        }
        if (state.scores[1] >= maxScore) {
            var result:[bigint,bigint] = [zero,one]//state.currentPlayer === 1 ? [zero,one] : [one,zero]
            setOutcome(state, result)
            return result;
        }

        let outcome:[bigint,bigint] = [zero,zero]
        for (let v of values) {
            const s = roll(state,v)
            const [p1Wins,p2Wins] = learnOutcome(s, d+1)

            outcome[0] += p1Wins
            outcome[1] += p2Wins
        }
        setOutcome(state, outcome);
        return outcome;
    }


    const gameState:GameState = {positions, scores, currentPlayer}
    const outcome = learnOutcome(gameState)

    //console.log(outcomes)

    return outcome[0] > outcome[1] ? outcome[0] : outcome[1]

}

const interpretResults = (playerPositions:number[]) => {
    const [losingPlayerScore, dieRolls] = playGame(playerPositions)
    return losingPlayerScore*dieRolls
}

// test('game starting at 4,8 is 739785', () => {
//     const result = interpretResults([4,8])
//     expect(result).toBe(739785)
// })

// test('Problem 1 output is...', () => {
//     const result = interpretResults([3,5])
//     console.log("Day 21, Problem 1", result)
// })

test('Problem 2 sample is 444356092776315', () => {
    const result = countWins([4,8])
    expect(result).toBe(BigInt(444356092776315))
})


test('Problem 2 actual is ...', () => {
    const result = countWins([3,5])
    console.log("Day 21, Problem 2", result)
})