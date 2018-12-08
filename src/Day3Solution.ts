import { AoCSolution } from "./AoCSolution";
import {loadFile} from "./Utils";

class Day3Solution extends AoCSolution {

    constructor() {
        super();
        this.options.aFilename = 'data/day3-parta.dat';
        this.options.bFilename = 'data/day3-parta.dat';
    }

    // answer: 111935
    partA() {
        let dim = 1000;

        //create & init grid
        let grid = new Array<number[]>(dim);
        for (let i = 0; i < grid.length; i++) {
            grid[i] = new Array<number>(dim).fill(0);
        }

        // read claims
        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);

        //input = [input[2]];
        let total = 0;

        // add each claim to grid, identify nonoverlap w/ 1, overlap cell w/ -1
        input.forEach(claim => {
            // Parse claim properties from the input line
            //
            // intentionally create a new regex for each loop. 
            // tried reusing regex but after 1st use, matching fails, 
            // thus the new regex with each loop
            const regex = /^#(\d+)\s@\s(\d+).(\d+):\s(\d+)x(\d+)/gm;
            let match = regex.exec(claim);
           
            let id = match[1];
            let x = parseInt(match[2]);
            let y = parseInt(match[3]);
            let width = parseInt(match[4]);
            let ht = parseInt(match[5]);

            // map the claim onto the grid, detect overlapping cells
            for (let row = y; row < y + ht; row++) {
                for (let col = x; col < x + width; col++) {
                    let val = grid[row][col];
                    if (val == 0) {
                        grid[row][col] = 1;
                    } else if (val == 1) {
                        grid[row][col] = -1;
                        total++;
                    }
                }
            }
        });

        console.log('Part-A total: ', total);
    }


    // answer: 650
    partB() {
        let claims: Claim[] = [];
        
        // read claims in to an array
        let input: string[];
        input = loadFile(this.options.bFilename, AoCSolution.EOL);
        input.forEach(claimString => {
            const regex = /^#(\d+)\s@\s(\d+).(\d+):\s(\d+)x(\d+)/gm;
            let match = regex.exec(claimString);

            let id = match[1];
            let x = parseInt(match[2]);
            let y = parseInt(match[3]);
            let width = parseInt(match[4]);
            let ht = parseInt(match[5]);

            let tl = new Point(x,y);
            let br = new Point(x+width-1,y+ht-1);

            let claim: Claim = new Claim(id,tl,br);
            claims.push(claim);
        });

        // detect overlapping claims
        for (let i=0; i < claims.length-1; i++) {
            for (let j=i+1; j < claims.length; j++) {
                let key: Claim = claims[i];
                let tgt: Claim = claims[j];
                if (key.overlaps(tgt)) {
                    key.collision = true;
                    tgt.collision = true;
                }
            }
        }

        // find the non-overlapping claim
        for (let i=0; i < claims.length; i++) {
            let claim = claims[i];
            if (!claims[i].collision) {
                console.log("Part-B non-overlap claim: ", claim);
            }
        }
    }

}

class Point {
    constructor(public x: number, public y: number) {
    }
}

class Claim {

    collision: boolean;

    constructor(public id: string, public tl: Point, public br: Point) {
        this.collision = false;
    }

    // Returns true if two rectangles (l1, r1) and (l2, r2) overlap
    overlaps(claim: Claim): boolean {
        // If one rectangle is on left side of other  
        if (this.br.x < claim.tl.x || this.tl.x > claim.br.x) { 
            return false; 
        } 
  
        // If one rectangle is above other  
        if (this.br.y < claim.tl.y || this.tl.y > claim.br.y) { 
            return false; 
        } 
  
        return true; 
    }
}

let solver = new Day3Solution();
solver.main();