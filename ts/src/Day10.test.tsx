import {sampleInput, actualInput} from './Day10Input'

const validateLine = (line:string) : [valid:boolean, message:string] => {
    line = line.trim();
    const isOpen = (ch:string) : boolean => ch == '(' || ch == '[' || ch == '{' || ch == '<';
    const closerFor = (opener:string) : string => {
        if (opener === '(') return ')'
        if (opener === '[') return ']'
        if (opener === '{') return '}'
        if (opener === '<') return '>'
        throw Error(`Unexpected: opener ${opener}`);
    }

    const isCloserFor = (closer:string, opener:string) : boolean => closer === closerFor(opener);

    const stack:string[] = []
    for(let ch of line.split('')) {
        if (isOpen(ch)) {
            stack.push(ch)
        } else {
            if (stack.length === 0) return [false, ch];
            const [top] = stack.slice(-1)
            if (isCloserFor(ch, top)) { 
                stack.pop();
            } else {
                return [false, ch]
            }
        }
    }
    return [true, [...stack.map(closerFor)].reverse().join('')];
}

function scoreProblem1(input:string[]) : number {
    const score = (ch:string) : number => {
        if (ch === ')') return 3;
        if (ch === ']') return 57;
        if (ch === '}') return 1197;
        if (ch === '>') return 25137;
        throw Error("bad input")
    }

    var validations = input.map(validateLine);
    const output = validations.filter(([isValid])=>!isValid).map(([isValid,errorString])=>errorString).map(score).reduce((a,b)=>a+b);

    return output;
}

function scoreProblem2(inputs:string[]):number {
    const scores:any = {
        ')':1,
        ']':2,
        '}':3,
        '>':4
    }

    const score = (input:string):number => {
        let score = 0;
        for(let ch of input.split('')) {
            score *= 5;
            score += scores[ch]
        }
        return score;
    }
    var scoreList = inputs.map(validateLine).filter(([isValid])=>isValid).map(([isValid,completion])=>completion).map(score);
    scoreList.sort((a,b)=>b-a)
    return scoreList[Math.floor((scoreList.length)/2)]
}

test('validator', () => {
    expect(validateLine('{([(<{}[<>[]}>{[]{[(<()>')).toStrictEqual([false, '}'])
})

test('problem 1 sample', () => {
    const output = scoreProblem1(sampleInput)
    expect(output).toBe(26397)
})

test('problem 1 actual is ...', () => {
    const output = scoreProblem1(actualInput)
    console.log("Day 10, Problem 1", output)
})

test('problem 2 sample is 288957', () => {
    const output = scoreProblem2(sampleInput)
    expect(output).toBe(288957);
})


test('problem 2 actual is ..', () => {
    const output = scoreProblem2(actualInput)
    console.log('Day 10, Problem 2', output)
})