export {}
import { actualInput } from "./Day08Input";
import * as _ from "lodash";

const sampleInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.toString().split("\n")

const getWordGroups = (input:string[]):string[][][] => {
    const splits = input.map(line => {
        const [left, right] = line.split(" | ")
        return [left, right]
    })
    const wordGroups = splits.map(line=>line.map(x=>x.split(' ')))
    return wordGroups
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