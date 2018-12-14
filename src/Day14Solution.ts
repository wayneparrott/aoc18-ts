import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

class Day14Solution extends AoCSolution {

    constructor() {
        super();

    }

    // answer 5115114101
    partA() {
        let elfs: number[] = [0, 1]; //idx of each elf's current recipe
        let scoreboard: number[] = [3, 7];
        let scoreboardStr: string = "";

        let recipeStart = 633601;
        let recipeLen = 10;

        do {
            let sum: number = elfs.reduce((total: number, curRecIdx: number) =>
                total + scoreboard[curRecIdx], 0);
            for (let ch of '' + sum) {
                scoreboard.push(Number(ch));

            }

            elfs.forEach((cur, idx) => {
                let nextCurIdx = (cur + scoreboard[cur] + 1) % scoreboard.length;
                elfs[idx] = nextCurIdx;
            });
        } while (scoreboard.length < recipeStart + recipeLen);

        let answer = scoreboard.slice(recipeStart, recipeStart + recipeLen);
        console.log("answer:", answer);
    }


    // answer: 20310465
    // Initially I used part-A algo as a starting pt but after letting it
    // run for 30 mins it slowed to a crawl. I assumed this is due to the 
    // growth of the scoreboard array and it's string represenation scoreboardStr.
    // To optimize this I preallocated the scoreboard array and focus on keeping the
    // scoreboardStr.length < 106 i.e., (100 + targetSeq.len). Keep track of the
    // number of trim procedures for use in calculating the number of chars (i.e., recipes)
    // in front of the match with the target.
    partB() {
        let elfs: number[] = [0, 1]; //idx of each elf's current recipe

        let max = 100000000;
        let scoreboard: number[] = new Array<number>(max);
        scoreboard[0] = 3;
        scoreboard[1] = 7;
        let scoreboardLen = 2;
        let scoreboardStr: string = "37";
        let trimSize = 100; // max size of scoreboardStr before truncating
        let trimCnt = 0;

        let targetSeq = "633601";
        //targetSeq = "51589";
        //targetSeq = "01245";
        //targetSeq = "59414";

        let gens = 0;  // for display purposes only


        let found = false;
        for (let i = 0; i < max && !found; i++) {
            let sum: number = elfs.reduce((total: number, curRecIdx: number) =>
                total + scoreboard[curRecIdx], 0);
            for (let ch of '' + sum) {
                scoreboard[scoreboardLen++] = Number(ch);
                scoreboardStr += ch;

                if (scoreboardStr.length == trimSize + 6) {
                    // truncate scoreboard for quicker searches
                    scoreboardStr = scoreboardStr.substring(trimSize); //keep last 6 chars
                    trimCnt++;
                }
            }

            elfs.forEach((cur, idx) => {
                let nextCurIdx = (cur + scoreboard[cur] + 1) % scoreboardLen;
                elfs[idx] = nextCurIdx;
            });

            if (++gens % 10000 == 0) {
                console.log("generation: ", gens);
            }

            found = scoreboardStr.includes(targetSeq);
        }

        let answer = trimCnt * trimSize + scoreboardStr.indexOf(targetSeq);
        console.log("answer:", answer);
    }
}

let solver = new Day14Solution();
solver.main();