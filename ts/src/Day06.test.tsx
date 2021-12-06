export {}

const sampleInput = [3,4,3,1,2];
const actualInput = [1,1,1,1,1,5,1,1,1,5,1,1,3,1,5,1,4,1,5,1,2,5,1,1,1,1,3,1,4,5,1,1,2,1,1,1,2,4,3,2,1,1,2,1,5,4,4,1,4,1,1,1,4,1,3,1,1,1,2,1,1,1,1,1,1,1,5,4,4,2,4,5,2,1,5,3,1,3,3,1,1,5,4,1,1,3,5,1,1,1,4,4,2,4,1,1,4,1,1,2,1,1,1,2,1,5,2,5,1,1,1,4,1,2,1,1,1,2,2,1,3,1,4,4,1,1,3,1,4,1,1,1,2,5,5,1,4,1,4,4,1,4,1,2,4,1,1,4,1,3,4,4,1,1,5,3,1,1,5,1,3,4,2,1,3,1,3,1,1,1,1,1,1,1,1,1,4,5,1,1,1,1,3,1,1,5,1,1,4,1,1,3,1,1,5,2,1,4,4,1,4,1,2,1,1,1,1,2,1,4,1,1,2,5,1,4,4,1,1,1,4,1,1,1,5,3,1,4,1,4,1,1,3,5,3,5,5,5,1,5,1,1,1,1,1,1,1,1,2,3,3,3,3,4,2,1,1,4,5,3,1,1,5,5,1,1,2,1,4,1,3,5,1,1,1,5,2,2,1,4,2,1,1,4,1,3,1,1,1,3,1,5,1,5,1,1,4,1,2,1];

type PlanType = [count:bigint, days:number[]];

const getPlan = (input:number[]) : PlanType => {
    const days = Array.from({length:9}).map(x=>0);
    for(let age of input) {
        days[age]++;
    }
    return [BigInt(input.length), days];
}

const advancePlan = (plan:PlanType) : PlanType => {
    const [oldCount, oldDays] = plan;
    const [newFish, ...remainingDays] = oldDays;

    const newDays = remainingDays.concat([0]);

    // new fish in 6 days and new fish in 8 days
    newDays[6] += newFish;
    newDays[8] += newFish;

    const count = oldCount + BigInt(newFish);

    return [count, newDays];
};

const goLanternfish = (initial:number[], days:number) : bigint => {
    let plan = getPlan(initial);
    for(let i=0; i<days; i++) {
        plan = advancePlan(plan);
    }
    return plan[0];
}

test('problem 1, sample output after 2 days is 6', () => {
    const output = goLanternfish(sampleInput, 2);
    expect(output).toBe(BigInt(6));
})

test('problem 1, actual output is...', () => {
    const output = goLanternfish(actualInput, 80);
    console.log("Day 6, Problem 1 ", output);
})

test('problem 2, sample output is 26984457539', () => {
    const output = goLanternfish(sampleInput, 256);
    expect(output).toBe(BigInt(26984457539));
})

test('problem 2, actual output is...', () => {
    const output = goLanternfish(actualInput, 256);
    console.log("Day 6, Problem 2 ", output)
})

