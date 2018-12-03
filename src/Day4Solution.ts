import { AoCSolution } from "./AoCSolution";



class Day4Solution extends AoCSolution {

    constructor() {
        super();
         this.options.aFilename = 'day4-parta.dat';
         this.options.bFilename = 'day4-partb.dat';
    }

    // answer 
    partA() {
        let input: string[];
        input = AoCSolution.loadFile(this.options.aFilename, AoCSolution.EOL);

    }

    // answer
    partB() {
        let input: string[];
        input = AoCSolution.loadFile(this.options.bFilename, AoCSolution.EOL);

    }
}

let solver = new Day4Solution();
solver.main();