import { AoCSolution } from "./AoCSolution";

class Day11Solution extends AoCSolution {

    readonly serial = 7139; //18; // 42; //18; //7803; //7139;
    readonly gridSize = 300;
    readonly grid: Array<Array<number>>;
    readonly sat: Array<Array<number>>; //summed area table

    constructor() {
        super();

        this.grid = Array<number>(this.gridSize).fill(null).
            map(() => new Array<number>(this.gridSize).fill(0));

        // create grid initialized with fuel cell power levels
        for (let i = 1; i <= this.gridSize; i++) {
            for (let j = 1; j <= this.gridSize; j++) {
                let rackId = j + 10;
                let powerLevel = Math.floor(((rackId * i + this.serial) * rackId) / 100 % 10) - 5;
                //console.log("power level: ", powerLevel);
                this.grid[i - 1][j - 1] = powerLevel;
            }
        }

        this.sat = this.buildSummedAreaTable(this.grid, this.gridSize);
    }

    // find max sum of 3x3 sub-matrix
    // answer [20,62], power = 30
    partA() {

        let max = -1000;
        let maxCoord = [0, 0];
        let maxSize = 0;

        // find max value 3X3
        for (let i = 0; i < this.gridSize - 3; i++) {
            for (let j = 0; j < this.gridSize - 3; j++) {

                let powerCell = this.sumGrid1(i, j, 3);

                if (powerCell > max) {
                    max = powerCell;
                    maxCoord = [i, j];
                }
            }
        }


        console.log("Part-A");
        console.log(`X[${maxCoord},${maxSize}] = ${max}`);
    }


    // answer: X[229,61,16] = 151
    // Inital impl was brute force search that took
    // about 20 mins. Replaced the cell area calc with a
    // summed area table which is a zillion times quicker. 
    //
    // Even though the correct answer is computed I think 
    // there is something goofed.
    partB() {
        let max = 0;
        let maxCoord = [0, 0];
        let maxSize = 0;

        for (let i = 0; i < this.gridSize - 1; i++) {
            for (let j = 0; j < this.gridSize - 1; j++) {

                let maxGridSize = Math.min(this.gridSize - i, this.gridSize - j);

                // min searchGridSize
                for (let gridSize = 2; gridSize < maxGridSize; gridSize++) {

                    let powerCell = this.sumGrid2(i, j, gridSize);

                    if (powerCell > max) {
                        max = powerCell;
                        maxCoord = [i+1,j+1];
                        maxSize = gridSize+1;
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

    sumGrid1(row: number, col: number, size: number): number {
        let sum = 0;
        for (let i = row; i < row + size; i++) { // cols
            for (let j = col; j < col + size; j++) { // rows
                sum += this.computePower(i, j, this.serial);
            }
        }
        return sum;
    }

    // A O(1) time function to compute sum of submatrix 
    // between (tli, tlj) and (rbi, rbj) using aux[][] 
    // which is built by the preprocess function 
    sumGrid2(row: number, col: number, size: number): number {

        let tli: number = row;
        let tlj: number = col;
        let rbi: number = tli + size;
        let rbj: number = tlj + size;

        // result is now sum of elements between (0, 0) and 
        // (rbi, rbj) 
        let res: number = this.sat[rbi][rbj];

        // Remove elements between (0, 0) and (tli-1, rbj) 
        if (tli > 0)
            res = res - this.sat[tli - 1][rbj];

        // Remove elements between (0, 0) and (rbi, tlj-1) 
        if (tlj > 0)
            res = res - this.sat[rbi][tlj - 1];

        // Add aux[tli-1][tlj-1] as elements between (0, 0) 
        // and (tli-1, tlj-1) are subtracted twice 
        if (tli > 0 && tlj > 0)
            res = res + this.sat[tli - 1][tlj - 1];

        return res;
    }

    // https://www.geeksforgeeks.org/submatrix-sum-queries/
    buildSummedAreaTable(grid: Array<Array<number>>, size: number): Array<Array<number>> {

        let sat = Array<number>(size).fill(null).
            map(() => new Array<number>(this.gridSize).fill(0));

        // Copy first row of grid[][] to sat[][]
        sat[0] = grid[0];

        // Do column wise sum 
        for (let i = 1; i < size; i++) {
            for (let j = 0; j < size; j++) {
                sat[i][j] = grid[i][j] + sat[i - 1][j];
            }
        }

        // Do row wise sum 
        for (let i = 0; i < size; i++) {
            for (let j = 1; j < size; j++) {
                sat[i][j] += sat[i][j - 1];
            }
        }

        return sat;
    }
}

let solver = new Day11Solution();
solver.main();
