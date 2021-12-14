import {sampleInput} from './Day14Input'
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

const applyTemplate = (counts:Counts, rules:Rules) => {
    // for each count in counts, look for matching rule.  if found, apply, 
    let inputPairs:string[] = []
    counts.forEach((count,pair) => inputPairs.push(pair));

    const newPairs = inputPairs.map(pair => {
        if (rules.has(pair)) {
            const element = rules.get(pair);
            const [first,second] = pair.split('');
            return [first+element,element+second]
        }
        else {
            return [pair]
        }
    }).flat()
    console.log(newPairs)
}

test('inputs', () => {
    const inputs = inputFromString(sampleInput);
    applyTemplate(getCountsFromTemplate(inputs.template), inputs.rules)
})