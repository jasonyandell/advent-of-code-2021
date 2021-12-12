import _ from "lodash";

export type Position = [row:number,column:number]

export const neighborDeltas4:Position[] = [[-1,0], [+1,0], [0,-1], [0,+1]]
export const neighborDeltas8:Position[] = [...neighborDeltas4, [-1,-1], [+1,-1], [-1,+1], [+1,+1]]

export const boundedNeighbors = (pos:Position, width:number, height:number, deltas:Position[]):Position[] => {
    const [row, col] = pos;
    const positions:Position[] = deltas.map(([rowDelta,colDelta]) => [row+rowDelta,col+colDelta]);
    return positions.filter( ([r,c]) => (r>=0 && r<height && c>=0 && c<width) )
}

export const gridNeighbors = (inputs:number[][], pos:Position, deltas:Position[]) => {
    const [height, width] = [inputs.length, (inputs.length) ? inputs[0].length : 0 ];
    return boundedNeighbors(pos, width, height, deltas)
}

export const gridNeighbors4 = (inputs:number[][], pos:Position):Position[] => gridNeighbors(inputs, pos, neighborDeltas4);
export const gridNeighbors8 = (inputs:number[][], pos:Position):Position[] => gridNeighbors(inputs, pos, neighborDeltas8);

export const getGrid = (input:string):number[][] => input.toString().split("\n").map(s=>s.trim()).map(line=>line.split('').map(x=>+x));
export const copyGrid = (grid:number[][]) : number[][] => grid.map(row => [...row])
export const pretty = (grid:number[][]):string => grid.map(row => row.reduce((p,col)=>p+col,"")).join("\n ")
