
import actualInstructions from './Day02Input.json'
const sampleInstructions = ["forward 5","down 5","forward 8","up 3","down 8","forward 2"];

type NumToVoid = (steps:number)=>void;

const interpret = (line:string, forward:NumToVoid, down:NumToVoid, up:NumToVoid) => {
    const [instruction, stepString] = line.split(" ");
    const step:number = +stepString; // really, typescript?

    if (instruction === "forward") forward(step);
    if (instruction === "down") down(step);
    if (instruction === "up") up(step);
}

const travel = (instructions: string[]): [horizontal:number, depth:number] => {
    let depth = 0;
    let horizontal = 0;

    const forward = (steps:number) => {horizontal += steps;};
    const down = (steps:number) => {depth += steps;};
    const up = (steps:number) => {depth -= steps;};

    instructions.forEach(line => interpret(line, forward, down, up));
    
    return [horizontal, depth];
}

const travel2 = (instructions: string[]): [horizontal:number, depth:number] => {
    let aim = 0;
    let depth = 0;
    let horizontal = 0;

    const forward = (steps:number) => {
        horizontal += steps;
        depth += aim*steps;
    };
    const down = (steps:number) => {aim += steps;};
    const up = (steps:number) => {aim -= steps;};

    instructions.forEach(line => interpret(line, forward, down, up));

    return [horizontal, depth];
}

test('sample 1 goes to [15,10] = 150', () => {
    const [horizontal, depth] = travel(sampleInstructions);
    expect(horizontal).toBe(15);
    expect(depth).toBe(10);
    expect(horizontal*depth).toBe(150);
})

test('actual 1 goes to ...', () => {
    const [horizontal, depth] = travel(actualInstructions);
    const output = {position:[horizontal,depth], total:horizontal*depth};
    console.log("Day 2, Problem 1", output);

});

test('sample 2 goes to [15,60] = 900', () => {
    const [horizontal, depth] = travel2(sampleInstructions);
    expect(horizontal*depth).toBe(900);
});

test('actual 2 goes to...', () => {
    const [horizontal, depth] = travel2(actualInstructions);
    const output = {position:[horizontal,depth], total:horizontal*depth};
    console.log("Day 2, Problem 2", output);
});