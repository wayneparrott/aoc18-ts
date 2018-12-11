import { AoCSolution } from "./AoCSolution";


class Day11Solution extends AoCSolution {

    readonly serial = 7139; //18; // 42; //18; //7803; //7139;
    readonly gridSize = 300;
    readonly grid: Array<Array<number>>;

    constructor() {
        super();

        this.grid = Array<number>(this.gridSize).fill(null).
            map(() => new Array<number>(this.gridSize).fill(0));

        //alt init
        //const grid1 = [...Array(300)].map(() => [...Array<number>(this.gridSize)].map(() => 0))

        // create grid initialized with fuel cell power levels
        for (let y = 1; y <= this.gridSize; y++) {
            for (let x = 1; x <= this.gridSize; x++) {
                let rackId = x + 10;
                let powerLevel = Math.floor(((rackId * y + this.serial) * rackId) / 100 % 10) - 5;
                //console.log("power level: ", powerLevel);
                this.grid[y - 1][x - 1] = powerLevel;
            }
        }

    }

    // find max sum of 3x3 sub-matrix
    // answer [20,62], power = 30
    partA() {

        let max = -1000;
        let maxCoord = [0, 0];
        let maxSize = 0;

        // find max value 3X3
        for (let row = 0; row < this.gridSize - 3; row++) {
            for (let col = 0; col < this.gridSize - 3; col++) {

                let powerCell = this.sumGrid(row, col, 3);

                if (powerCell > max) {
                    max = powerCell;
                    maxCoord = [col, row];
                }
            }
        }


        console.log("Part-A");
        console.log(`X[${maxCoord},${maxSize}] = ${max}`);
    }


    // answer: X[229,61,16] = 151
    // This brute force solution from reddit
    // that is slow as dirt....
    partB() {
        let max = 0;
        let maxCoord = [0, 0];
        let maxSize = 0;


        for (let row = 0; row < this.gridSize-1; row++) {
            for (let col = 0; col < this.gridSize-1; col++) {

                let maxGridSize = Math.min(this.gridSize-row,this.gridSize-col);

                // min searchGridSize
                for (let gridSize=2; gridSize < maxGridSize; gridSize++) {

                    let powerCell = this.sumGrid(row, col, gridSize);

                    if (powerCell > max) {
                        max = powerCell;
                        maxCoord = [col,row];
                        maxSize = gridSize;
                    }
                }
            }
        }

        console.log("Part-B");
        console.log(`X[${maxCoord},${maxSize}] = ${max}`);
    }

    computePower(x: number, y: number, serial: number): number {
        let rackId = x + 10;
        return Math.floor(((rackId * y + serial) * rackId) / 100 % 10) - 5;
    }

    sumGrid(row: number, col: number, size: number): number {
        let sum = 0;
        for (let i = row; i < row+size; i++) { // cols
            for (let j = col; j < col+size; j++) { // rows
                sum += this.computePower(i, j, this.serial);
            }
        }
        return sum;
    }
}

let solver = new Day11Solution();
solver.main();
