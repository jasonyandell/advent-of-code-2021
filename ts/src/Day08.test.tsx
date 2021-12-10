export {}
import { sampleInput, actualInput } from "./Day08Input";

const getWordGroups = (input:string[]):string[][][] => {
    const splits = input.map(line => {
        const [left, right] = line.split(" | ")
        return [left, right]
    })
    const wordGroups = splits.map(line=>line.map(x=>x.split(' ')))
    return wordGroups
}

const numbersAsLetters:string[] = [
    "abcefg",
    "cf",
    "acdeg",
    "acdfg",
    "bcdf",
    "abdfg",
    "abdefg",
    "acf",
    "abcdefg",
    "abcdfg"
]

const permutations = (arr:any[]) : any[][] => {
    if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
    return arr.reduce(
      (acc, item, i) =>
        acc.concat(
          permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [
            item,
            ...val,
          ])
        ),
      []
    );
  };

const allMaps:string[] = permutations("abcdefg".split('')).map(stringArray => stringArray.reduce((a:string,b)=>a+b),"");

const alphaSortString = (s:string):string =>([...s.split('')].sort()).reduce((a,b)=>a+b);

function getMap(translationMap:string):any {
    const aCharCode = 'a'.charCodeAt(0);
    const map = {};

    for(let i=0; i<7; i++) {
        const curr = String.fromCharCode(i+aCharCode);
        map[translationMap[i]] = curr
    }
    return map;
}

function applyMap(map:any, input:string):string {
    let result = "";
    for(let i=0; i<input.length; i++) {
        result += map[input[i]];
    }
    return alphaSortString(result);
}

const getDigit = (translated:string):number => numbersAsLetters.indexOf(translated);

const tryTranslationMap = (inputs:string[], map:any) : boolean => {
    const digits = inputs.map(entry => {
        const translated = applyMap(map, entry);
        const digit=getDigit(translated)
        return digit;
    })
    const success = !digits.includes(-1);
    return success;
}

function solve(rawInputs:string[], rawOutputs:string[]):number {
    // 
    //  dddd
    // e    a
    // e    a
    //  ffff
    // g    b
    // g    b
    //  cccc    

    // generate map.  the above would be 
    //          "abcdefg"
    //          "deafgbc", which means map d:a,e:b,a:c,f:d, etc.
    // apply map to input:
    // example: 5 in the sample is cdfbe, sorted is bcdef, apply map above
    // bcdef
    // fgabd.
    // sorted: abdfg
    // checking numbersAsLetters, that's 5, so this one works.  
    // 
    // now check all 10. if they all show up in numbersAsLetters, code is good.  apply it to right hand side 

    const sortedInputs = rawInputs.map(alphaSortString)
    const goodTranslationMap = allMaps.find(translationMap => {
        const map = getMap(translationMap);
        return tryTranslationMap(sortedInputs, map)
    })
    const workingMap = getMap(goodTranslationMap) // either one works, or crash
    const sortedOutputs = rawOutputs.map(alphaSortString);
    const digits = sortedOutputs.map(output => getDigit(applyMap(workingMap, output)))
    return Number(digits.reduce((a,b)=>a+b,""));
}

const solveMany = (inputs:string[]) : number[] => {
    return inputs.map(entry => {
        const [inputs,outputs] = entry.split(" | ");
        return solve(inputs.split(' '), outputs.split(' '));
    })
}

const problem2 = (inputs:string[]):number => {
    const allDigits = solveMany(inputs);
    const sum = allDigits.reduce((a,b)=>a+b)
    return sum;
}

const calculate = (input:string[]) : number => {
    const outputs = getWordGroups(input).map(lineGroup => lineGroup[1]);
    const knownGroups = outputs.flat().filter(group => {
        const size = group.length
        return (size===2) || (size===3) || (size===4) || (size == 7);
    });
    return knownGroups.length;
}

test('there are 26', () => {
    const output = calculate(sampleInput)
    expect(output).toBe(26)
})

test('problem 1 output is..', () => {
    const output = calculate(actualInput)
    console.log("Day 8, Problem 1", output)
})

test('problem 2, first sample works', () =>{
    const rawInputs = "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab".split(' ');
    const rawOutputs = "cdfeb fcadb cdfeb cdbaf".split(" ");
    expect(solve(rawInputs, rawOutputs)).toBe(5353);
})

test('problem 2, sample input should be 61229', () => {
    const sum = problem2(sampleInput);
    expect(sum).toBe(61229)
})

test('problem 2, actual output is...', () => {
    const output = problem2(actualInput);
    console.log("Day 8, Problem 2", output)
})

