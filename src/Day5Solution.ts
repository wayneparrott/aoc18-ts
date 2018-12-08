import { AoCSolution } from "./AoCSolution";
import {loadFile} from "./Utils";

class Day5Solution extends AoCSolution {

    constructor() {
        super();
        this.options.aFilename = 'data/day5-parta.dat';
    }

    // Part-A
    // result:  9238 
    partA() {
        // split the line into an array of char ASCI codes
        let polymer = this.loadpolymer(this.options.aFilename);
        let result = this.react(polymer);

        console.log('Part-A');
        console.log('result: ', result.length);
        //console.log(result);
    }

    // answer: 4052 
    partB() {
        // split the line into an array of char ASCI codes
        let masterpolymer = this.loadpolymer(this.options.aFilename);

        // loop from A/a(65/97) - Z/z(90/122) 
        //   remove char & react, find the smallest resulting string
        let min = Number.MAX_SAFE_INTEGER;
        let ACharCode = 65;
        let ZCharCode = 90;
        for (let i=ACharCode; i <= ZCharCode; i++) {
            let polymer = masterpolymer.filter(element => element != i && element != i+32);
            let len = this.react(polymer).length;
            min = Math.min(min,len);
        }

        console.log('Part-B');
        console.log('result: ', min);
    }

    // load the input polymer string and convert it to a charCode array
    loadpolymer(path: string) {
        let input: string[];
        input = loadFile(path);

        // split the line into an array of char ASCI codes
        let polymer = input[0].split(/(?:)/u).map(str1 => { return str1.charCodeAt(0) });

        return polymer
    }

    // iterate over polymer array eliminating chars that react
    // repeat this until no further reactions.
    // return the resulting polymer chain of chars as a string
    //
    // rather than repeatedly remove reacted chars by shortening the polymer array
    //  replace reacted chars with 0. Then once reaction has terminated, filter the 0's
    //  and convert to a string
    react(polymer: number[]): string {
        // iterate thru polymer until leftPt points to last char in array
        let nullChar = 0;
        let done: boolean;
        do {
            done = true;

            // position leffPtr to a non-zero char
            let leftPtr = this.nextPosition(0, polymer);
            let rightPtr = this.nextPosition(leftPtr + 1, polymer);

            while (leftPtr > -1 && rightPtr > -1) {
                if (Math.abs(polymer[leftPtr] - polymer[rightPtr]) == 32) {
                    done = false;
                    polymer[leftPtr] = nullChar;
                    polymer[rightPtr] = nullChar;
                }
                leftPtr = this.nextPosition(leftPtr + 1, polymer);
                rightPtr = this.nextPosition(leftPtr + 1, polymer);
            }

        } while (!done);

        return String.fromCharCode(...polymer.filter(element => element != 0));
    }

    // move cursor forward to the next non-zero charCode
    // return idx or -1 if exceed charCodes.length
    nextPosition(startIdx: number, charCodes: number[]): number {
        let idx = startIdx;
        for (; idx < charCodes.length && charCodes[idx] == 0; idx++);
        return idx < charCodes.length ? idx : -1;
    }
}

let solver = new Day5Solution();
solver.main();