import { sampleInput, actualInput } from "./Day3Input";

export {}

const countOnBits = (input:string[], column:number):number => {
    let bits = 0;
    for(let i = 0; i < input.length; i++) {
        if (input[i][column] === '1') bits++;
    }
    return bits;
}

const getColumnCounts = (input:string[]) : number[] => {
    const width = input[0].length;
    let result = [];
    for(let i = 0; i < width; i++) {
        result.push(countOnBits(input, i));
    }
    return result;
}

const calculateStrings = (input:string[]) : [gamma:string, epsilon:string] => {
    const columnCounts = getColumnCounts(input);
    const height = input.length;
    const majority = height / 2 ;

    let gamma = "";
    let epsilon = "";
    for(let i = 0; i < columnCounts.length; i++) {
        if (columnCounts[i] > majority) {
            gamma += '1';
            epsilon += '0'
        } else {
            gamma += '0';
            epsilon += '1';
        }
    }

    return [gamma, epsilon];
}

const toInt = (binary:string) : number => parseInt(binary, 2);

const compute = (input:string[]) : number => {
    const [gammaString, epsilonString] = calculateStrings(input);
    const [gamma, epsilon] = [toInt(gammaString), toInt(epsilonString)];
    return gamma*epsilon;
}


test('first column has 7 1 bits', () => {
    const actual = countOnBits(sampleInput, 0);
    expect(actual).toBe(7);
})

test('gamma counts are as described', () => {
    const [gamma, epsilon] = calculateStrings(sampleInput);
    expect(gamma).toBe('10110');
    expect(epsilon).toBe('01001');
})

test('binary conversion works appropriately', () => {
    const actual = toInt('10110');
    expect(actual).toBe(22);
});

test('Sample output is 198', () => {
    const actual = compute(sampleInput);
    expect(actual).toBe(198);
});

test('Actual output is ..', () => {
    const actual = compute(actualInput);
    console.log("Day 3, Problem 1", actual);
});