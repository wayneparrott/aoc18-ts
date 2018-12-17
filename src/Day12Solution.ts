import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";
//import * as _ from "lodash";


interface RulePattern {
    pattern: string,
    result: string
}

class Day12Solution extends AoCSolution {

    constructor() {
        super();
        this.options.aFilename = 'data/day12.dat';
        this.options.bFilename = 'data/day12.dat';
    }

    // answer: 4200
    partA() {
        console.log("Part-A");
        let result = this.process(20);
        console.log("TOTAL: ", result);
    }

    // answer: 9699999999321
    // I printed out the diff between totals up to 200 generations.
    // At gen(183) the diff between current total and prev total is 194.
    // At that point for some reason I goofed up my equation to exploit
    // the pattern. I then looked at the redit discussion and noticed I 
    // was on to something but my result was 194 off the correct answer
    // but I didn't know that at the time because I didn't know the answer.
    // So I looked at a redit solution and ran my generation to 2000.
    // Then it worked. Credit to AndrewGreenh.
    partB() {
        console.log("Part-B");
        let result = this.process(2000) + (50000000000 - 2000) * 194;
        console.log("TOTAL: ", result);
    }

    process(generations: number): number {

        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);
        let state = input[0].substring(15); //skip over "initial state: xxxxx"

        // build patterns list
        let rulesPatterns: RulePattern[] = [];
        input.slice(2).forEach((line) => {
            rulesPatterns.push(
                {
                    pattern: line.substring(0, 5),
                    result: line.substring(9)
                });
        });

        let startIdx = 0;
        for (let gen = 1; gen <= generations; gen++) {
            let result: [string, number] =
                this.computeNextGeneration(state, rulesPatterns, startIdx);
            [state, startIdx] = result;
        }

        return this.computeTotal(state,startIdx);
    }

    computeNextGeneration(state: string, rules: RulePattern[], startIdx: number): [string, number] {

        let [paddedState, newStartIdx] = this.padState(state, startIdx);
        let newState = "..";

        for (let i = 0; i < paddedState.length - 5; i++) {

            let searchFrame = paddedState.substring(i, i + 5);
            let found = false;

            for (let j = 0; j < rules.length; j++) {
                found = searchFrame.startsWith(rules[j].pattern);
                if (found) {
                    //console.log("\nmatch: ", j, i, rules[j], "|", state, "|", newState);
                    newState += rules[j].result;
                    break;
                }
            }
            if (!found) {
                newState += "."
            }
        }
        //console.log(newState, state);
        return [newState, newStartIdx];
    }

    computeTotal(state: string, startIdx: number): number {
        let total = 0;
        for (let i = 0, potId = startIdx; i < state.length; i++ , potId++) {
            if (state.charAt(i) == "#") {
                //console.log(potId);
                total += potId;
            }
        }
        return total;
    }


    padState(state: string, startIdx: number): [string, number] {
        //find the idx of first #, if < 3 pad to 3 dots
        let newState = state;
        let newStartIdx = startIdx;

        //find the idx of first #, if < 3 pad to 3 dots
        let idx = state.indexOf("#");
        let dotsNeeded = 4 - idx;
        for (let i = 0; i < dotsNeeded; i++) {
            newState = "." + newState;
            newStartIdx--;
        }

        //find the idx of the last #, if state.len-idx < 3 then pad to 3 dots
        idx = state.lastIndexOf("#");
        dotsNeeded = idx - state.length + 5;
        for (let i = 0; i < dotsNeeded; i++) {
            newState += ".";
        }

        return [newState, newStartIdx];
    }
}

let solver = new Day12Solution();
solver.main();
