import { AoCSolution } from "./AoCSolution";


class Day9Solution extends AoCSolution {

    constructor() {
        super();
    }

    // answer: 388024
    // input: "470 players; last marble is worth 72,170 points"
    partA() {
        console.log("Part-A");
        let score = this.computeHighScore(470,72170);
        console.log("High score: ", score);
    }

    // answer: 3180929875
    // input: "470 players; last marble is worth 7,217,000 points"

    // note: this implementation using array.slice() is WAY WAY too 
    // inefficent for solving part-B. I retained this solution as 
    // I was too sleepy to reimpl atm. So I let it run while I grab
    // a few winks with the plan to reimpl using a dynamic list such
    // as a circular double linked list. When I returned a few hours
    // later the solution was complete.
    partB() {
        console.log("Part-B");
        let score = this.computeHighScore(470,72170 * 100);
        console.log("High score: ", score);
    }


    computeHighScore(playerCnt: number, marbleCnt: number): number {
        
        const board = [0];

        let scores = new Array<number>(playerCnt);
        scores.fill(0);


        let currentIdx = 1;
        for (let curMarble = 1; curMarble <= marbleCnt; curMarble++) {
            
            if (curMarble % 10000 == 0) console.log("curMarble: ", curMarble);

            if (curMarble % 23) {
                currentIdx = (currentIdx + 1) % board.length + 1;
                board.splice(currentIdx, 0, curMarble);
            } else {
                currentIdx = (currentIdx - 7 + board.length) % board.length;
                scores[curMarble%playerCnt] += curMarble + board.splice(currentIdx, 1)[0];
                currentIdx %= board.length;
            }
        }

        return Math.max(...scores);        
    }

    
}

let solver = new Day9Solution();
solver.main();
