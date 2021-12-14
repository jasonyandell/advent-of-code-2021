import {sampleInput, actualInput} from './Day14Input'
import '@testing-library/jest-dom'
import _ from 'lodash'

type Rules = Map<string,string>
type Input = {template:string, rules:Rules}
type Counts = Map<string, number>

const inputFromString = (input:string) : Input => {
    const inputs = input.split('\n')
    const templates:[string,string][] = inputs.slice(2).map(s=> {
        const [a,b] = s.split(' -> ')
        return [a,b]
    })
    return {
        template: inputs[0],
        rules:new Map<string,string>(templates)
    }
}

const getCountsFromTemplate = (template:String):Counts => {
    const pairs = template.slice(0,-1).split('').map((s,i) => template.slice(i,i+2))
    return new Map<string, number>(pairs.map(pair => [pair,1]))
}

type PairCount = {pair:string, count:number}

const applyTemplate = (counts:Counts, rules:Rules):Counts => {
    // for each count in counts, look for matching rule.  if found, apply, 
    const inputPairCounts:PairCount[] = Array.from(counts.entries()).map( ([pair,count]) => ({pair,count}) )

    const newPairs = inputPairCounts.map(pairCount => {
        if (rules.has(pairCount.pair)) {
            const {pair, count} = pairCount
            const element = rules.get(pair);
            const [first,second] = pair.split('');
            return [ {pair:first+element, count}, {pair:element+second, count}]
        }
        else {
            return [pairCount]
        }
    }).flat()

    const newCounts = new Map<string,number>()
    newPairs.forEach(({pair,count}) => newCounts.set(pair, (newCounts.get(pair) ?? 0) + count))

    return newCounts;
}

const getMostLeastCommon = (counts:Counts) => {
    const elements = new Map<string, number>()
    counts.forEach((v,k) => {
        elements.set(k[1], (elements.get(k[1]) ?? 0) + v)  // character always appears at ENDS, not always at start -- ie last character in string wont appear as start of pair
    });

    const appearances = Array.from(elements.values())
    const most = appearances.reduce((most,curr)=>Math.max(most,curr))
    const least = appearances.reduce((least,curr)=>Math.min(least,curr))
    return most-least
}

const run = (input:string, iterations:number):number => {
    const inputs = inputFromString(input);
    const initialCounts = getCountsFromTemplate(inputs.template)
    const currCounts = _.range(0,iterations).reduce( (counts, i) => applyTemplate(counts, inputs.rules), initialCounts)
    return getMostLeastCommon(currCounts);
}

test('problem 1, sample input', () => {
    expect(run(sampleInput, 10)).toBe(1588)
}) 

test('problem 1, actual input', () => {
    console.log("Day 14, Problem 1", run(actualInput, 10))
}) 

test('problem 2, sample input', () => {
    expect(run(sampleInput, 40)).toBe(2188189693529)
}) 

test('problem 2, actual input', () => {
    console.log("Day 14, Problem 2", run(actualInput, 40))
}) 

