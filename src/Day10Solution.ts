import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

class Vector {
    x: number;
    y: number;

    constructor(public x1: number, public y1: number,
        public mX: number, public mY: number) {
        this.x = x1;
        this.y = y1;
    }
}

// There were 2 approaches that I thought of for solving this problem
// A) recognize that when all of the pts have at least 1 neighbor or
// B) find the min bounding box
// I went with approach-A as it was the 1st solution I thought of and it
// worked properly. The bounding box approach would definitely have been 
// to implement and to execute.
class Day10Solution extends AoCSolution {
    static readonly MAX_TIMER = 20000;

    constructor() {
        super();
        this.options.aFilename = 'data/day10.dat';
    }

    // answer: BAJXJAEX
    partA() {
        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);

        // position=< 2, -4> velocity=< 2,  2>
        let vectors =
            input.map(line => {
                const regex = /^position=<(\s*-?\d+),(\s*-?\d+)> velocity=<(\s*-?\d+),(\s*-?\d+)>/gm;
                let match = regex.exec(line);
                return new Vector(
                    parseInt(match[1]),
                    parseInt(match[2]),
                    parseInt(match[3]),
                    parseInt(match[4]));
            });

        let timer = 0;
        let msgFound;
        do {
            msgFound = true;

            //determine if a msg is avail by testing if every vector
            // is touching at least 1 other vector
            for (let i = 0; i < vectors.length; i++) {
                let adjacent = false;
                for (let j = 0; j < vectors.length && !adjacent; j++) {
                    if (i == j) continue;
                    let deltax = Math.abs(vectors[i].x - vectors[j].x);
                    let deltay = Math.abs(vectors[i].y - vectors[j].y);

                    adjacent =
                        (deltax == 1 && deltay == 0) ||
                        (deltax == 0 && deltay == 1) ||
                        (deltax == 1 && deltay == 1);
                }

                if (!adjacent) {
                    msgFound = false;
                    break;
                }

            }

            if (!msgFound) {
                //update vector locations for 1 sec
                vectors.forEach(vector => {
                    vector.x += vector.mX;
                    vector.y += vector.mY;
                });

                timer++;
            }

        } while (!msgFound && timer < Day10Solution.MAX_TIMER);

        console.log("Part-A")
        if (msgFound) {
            console.log(`Found at ${timer} seconds`);
            this.displayVectors(vectors);
        } else
            console.log("No solution found :(");

    }


    // answer: 10605
    partB() {
        //see the Part-A output which includes the number seconds (timer)

    }


    displayVectors(vectors: Vector[]): void {
        let minX = Math.min(...vectors.map(vector => vector.x));
        let minY = Math.min(...vectors.map(vector => vector.y));
        let maxX = Math.max(...vectors.map(vector => vector.x));
        let maxY = Math.max(...vectors.map(vector => vector.y));

        //console.log("display");
        //console.log("tl:", minX, ",", minY, "  br:", maxX, ",", maxY);

        let width = Math.abs(maxX - minX + 1);
        let ht = Math.abs(maxY - minY + 1);
        let transX = -minX;
        let transY = -minY;

        for (let y = 0; y < ht; y++) {
            let line = "";
            for (let x = 0; x < width; x++) {
                let ch = ".";
                for (let i = 0; i < vectors.length; i++) {
                    let vector = vectors[i];
                    if (vector.x + transX == x && vector.y + transY == y) {
                        ch = '#'
                        break;
                    }
                }
                line += ch;
            }
            console.log(line);
        }

    }
}

let solver = new Day10Solution();
solver.main();
