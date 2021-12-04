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

const computeRatingsStrings = (input:string[]) : [oxygenString:string, co2String:string] => {
    const filterBy = (input:string[], predicate:((value:number, majority:number)=>string)) : string => {
        const width = input[0].length;
        let candidates = input;
        for(let i = 0; i < width; i++) {
            const columnCounts = getColumnCounts(candidates);
            const height = candidates.length;
            const majority = height / 2 ;
            const mostCommon = columnCounts.map(count => predicate(count, majority));

            candidates = candidates.filter(candidate => {
                return (candidate[i] === mostCommon[i]);
            });

            if (candidates.length == 1) break;
        }
        return candidates[0];
    };

    const filterByMostCommon = (input:string[]) : string => {
        return filterBy(input, (count, majority) => count>=majority?'1':'0');
    }
    const filterByLessCommon = (input:string[]) : string => {
        return filterBy(input, (count, majority) => count<majority?'1':'0');
    }

    const oxygenString = filterByMostCommon(input);
    const co2String = filterByLessCommon(input);

    return [oxygenString, co2String]; 
}

const computeRatings = (input: string[]): [oxygen:number, co2:number] => {
    const [oxygenString, co2String] = computeRatingsStrings(input);
    return [toInt(oxygenString), toInt(co2String)];
}

test('first column has 7 1 bits', () => {
    const actual = countOnBits(sampleInput, 0);
    expect(actual).toBe(7);
});

test('gamma counts are as described', () => {
    const [gamma, epsilon] = calculateStrings(sampleInput);
    expect(gamma).toBe('10110');
    expect(epsilon).toBe('01001');
});

test('binary conversion works appropriately', () => {
    const actual = toInt('10110');
    expect(actual).toBe(22);
});

test('Sample output is 198', () => {
    const actual = compute(sampleInput);
    expect(actual).toBe(198);
});

test('Problem 1 actual output is ..', () => {
    const actual = compute(actualInput);
    console.log("Day 3, Problem 1", actual);
});

test('Problem 2 sample is 230', () => {
    const [oxygen, co2] = computeRatings(sampleInput);
    expect([oxygen, co2]).toEqual([23, 10]);

    const actual = oxygen*co2;
    expect(actual).toBe(230);
});

test('Problem 2 actual is ...', () => {
    const [oxygen, co2] = computeRatings(actualInput);
    console.log("Day 3, Problem 2", oxygen*co2);
});

