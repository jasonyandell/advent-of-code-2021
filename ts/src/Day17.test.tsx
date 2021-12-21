export {}

type Position = [x:number,y:number]

const highestY = ([[xMin,xMax],[yMin,yMax]]:[Position,Position]) : [number, Position[]]=> {

    const simulate = (vx:number,vy:number) : [boolean, number] => {
        let [x,y] = [0,0]
        let maxY = 0
        let foundHit = false;
        while (true) {
            x += vx
            y += vy

            vx = (vx>0) ? vx-1 : 0
            vy = vy - 1

            if (y > maxY) maxY = y

            if (y < yMin) break; // we passed it
            if ((vx === 0) && ((x<xMin) || (x>xMax))) break; // we stalled but can't hit the target
            if ((x>=xMin) && (x<=xMax) && (y>=yMin) && (y<=yMax)) {
                foundHit = true;
                if (vy < 0) break; // found hit and going down, bestY is never getting bigger
            }
        }

        return [foundHit, maxY]
    }

    let highestY = 0;
    let hits:Position[] = []
    for(let x0 = 0; x0<=xMax; x0++) {
        for (let y0 = -1000; y0<1000; y0++) {
            const [foundHit,maxY] = simulate(x0,y0)
            if (foundHit) hits.push([x0,y0])
            if (foundHit && maxY>highestY) highestY = maxY
        }
    }

    return [highestY,hits]
}

test('Sample problems', () => {
    const [highest, hits] = highestY([[20,30],[-10,-5]])
    expect(highest).toBe(45)
    expect(hits.length).toBe(112)
})

test('Actual problems ...', () => {
    const [highest, hits] = highestY([[96,125],[-144,-98]])
    console.log("Day 17, Problem 1", highest)
    console.log("Day 17, Problem 2", hits.length)
})