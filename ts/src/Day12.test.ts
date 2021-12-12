import { monitorEventLoopDelay } from "perf_hooks";
import { stringify } from "querystring";
import { transpileModule, visitNodes } from "typescript";

export {}

const getInput = (s:string):string[] => s.split('\n').map(s=>s.trim());

const sampleInput = getInput(`start-A
start-b
A-c
A-b
b-d
A-end
b-end`);

const getPaths = (inputs:string[], extraTime:boolean=false):string[] => {
    const graph:Map<string, string[]> = new Map<string, string[]>();

    inputs.forEach(input => {
        const [a,b] = input.split('-');
        const addVertex = (source:string, dest:string) => {
            const vertices = graph.get(source) ?? [];
            graph.set(source,[...vertices, dest]);
        }
        addVertex(a,b);
        addVertex(b,a);
    })

    graph.forEach((value,key)=>value.sort())

    const visited = new Map<string, number>()
    const visit = (node:string) => visited.set(node, (visited.get(node)??0)+1)
    const unvisit = (node:string) => visited.set(node, (visited.get(node)??0)-1)
    const canVisit = (node:string):boolean => {
        if (node.length === 0) false;

        const isUpper = (s:string) => s[0].toUpperCase() === s[0]

        // can always visit big caves
        if (isUpper(node)) return true;

        const timesThisNodeVisited = (visited.get(node)??0);

        if (timesThisNodeVisited < 1) return true;

        if (!extraTime) return false;

        if (node === 'start') return false;

        let smallCaveVisits:string[] = [];
        visited.forEach((v,k)=>{
            if (k === 'start') return;
            if (isUpper(k)) return;
            if (v>1) smallCaveVisits.push(k);
        })

        if (smallCaveVisits.length < 1) return true;
        if (smallCaveVisits.length > 2) return false;

        const [visitedTwice] = smallCaveVisits;
        if (visitedTwice === node) return false;
        // somebody else visited twice.  return I've never been visited
        return timesThisNodeVisited === 0
    }

    const dfs = (node:string,past:string[]):string[][] => {
        const soFar = [...past, node]
        if (node === 'end') return [soFar];

        var possibleNeighbors = (graph.get(node) ?? []);
        const neighbors = possibleNeighbors.filter(canVisit)
        const ret = neighbors.map(neighbor => {
            visit(neighbor)
            const paths:string[][] = dfs(neighbor, soFar)  // [[a,end],[a,b,end]]
            unvisit(neighbor)

            return paths;
        })

        return ret.reduce((all,item) => all.concat(item),[]);
    }

    for(let i = 0; i<100;i++) visit('start')
    const paths = dfs('start', []);
    return paths.map(ps => ps.join(','));
}

test('2 paths in contrived', () => {
    const contrived = getInput(`start-A
    start-b
    b-end
    A-end`);
    const paths = getPaths(contrived)
    expect(paths.length).toBe(2);
})

test('10 paths in sample 1, problem 1', () => {
    const paths = getPaths(sampleInput)
    expect(paths.length).toBe(10);
})

test('19 paths through slightly larger example', () => {
    const larger = getInput(`dc-end
    HN-start
    start-kj
    dc-start
    dc-HN
    LN-dc
    HN-end
    kj-sa
    kj-HN
    kj-dc`);
    const paths = getPaths(larger)
    expect(paths.length).toBe(19);
})


test('226 paths through even larger example', () => {
    const larger = getInput(`fs-end
    he-DX
    fs-he
    start-DX
    pj-DX
    end-zg
    zg-sl
    zg-pj
    pj-he
    RW-he
    fs-DX
    pj-RW
    zg-RW
    start-pj
    he-WI
    zg-he
    pj-fs
    start-RW`);
    const paths = getPaths(larger)
    expect(paths.length).toBe(226);
})

test('problem 1 output is...', () => {
    const larger = getInput(`pq-GX
    GX-ah
    mj-PI
    ey-start
    end-PI
    YV-mj
    ah-iw
    te-GX
    te-mj
    ZM-iw
    te-PI
    ah-ZM
    ey-te
    ZM-end
    end-mj
    te-iw
    te-vc
    PI-pq
    PI-start
    pq-ey
    PI-iw
    ah-ey
    pq-iw
    pq-start
    mj-GX`);
    const paths = getPaths(larger)
    console.log('Day 12, Problem 1', paths.length)
})

test('10 paths in sample 1, problem 2', () => {
    const paths = getPaths(sampleInput, true)
    expect(paths.length).toBe(36);
})

test('problem 1 output is...', () => {
    const larger = getInput(`pq-GX
    GX-ah
    mj-PI
    ey-start
    end-PI
    YV-mj
    ah-iw
    te-GX
    te-mj
    ZM-iw
    te-PI
    ah-ZM
    ey-te
    ZM-end
    end-mj
    te-iw
    te-vc
    PI-pq
    PI-start
    pq-ey
    PI-iw
    ah-ey
    pq-iw
    pq-start
    mj-GX`);
    const paths = getPaths(larger, true)
    console.log('Day 12, Problem 1', paths.length)
})
