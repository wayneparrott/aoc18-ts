import { AoCSolution } from "./AoCSolution";


class Day2Solution extends AoCSolution {

    constructor() {
        super();
        this.options.aFilename = 'data/day2-parta.dat';
        this.options.bFilename = 'data/day2-parta.dat'; // reuse parta input
    }

    // answer: 6972
    partA() {
        let twos = 0;
        let threes = 0;

        // read each id, build a frequence table for each char in the id.
        // then find the double and triple matches
        let input: string[];
        input = AoCSolution.loadFile(this.options.aFilename, AoCSolution.EOL);
        
        input.forEach((id: string) => {

            // create ascii char frequency table
            let freq = new Array<number>(256).fill(0);
            for (let i = 0; i < id.length; i++) {
                freq[id.charCodeAt(i)]++;
            }

            // find the double and triple hits
            let twosFound = false;
            let threesFound = false;
            freq.forEach((cnt: number) => {
                if (!twosFound && cnt == 2) {
                    twos++;
                    twosFound = true;
                } else if (!threesFound && cnt == 3) {
                    threes++;
                    threesFound = true;
                }
            });
        });

        console.log("Part-A")
        console.log("twos: ", twos);
        console.log("threes: ", threes);
        console.log("total: ", (twos * threes));
    }

    //	Match found
    //	id15: aixwcbzrmdvpsjfgllthdyeoqe
    //	id219: aixwcbzrmdvpsjfgllthdyioqe
    //	matching chars: aixwcbzrmdvpsjfgllthdyoqe
    partB() {
        let ids: string[] = AoCSolution.loadFile(this.options.bFilename, AoCSolution.EOL);

        // pair-wise compare all ids to detect the 2 ids with 1 mismatch
        // accumulate matched chars between 2 ids in matchesBuffer
        let matchesBuffer: string;
		for (let i: number = 0; i < ids.length - 1; i++) {
			let idKey = ids[i];
			
			for (let j: number = i + 1; j < ids.length; j++) {
				let idTarget = ids[j];

				let misses = 0;
				matchesBuffer = "";
				
				// assumption: all ids are the same length
				for (let k: number = 0; k < idKey.length; k++) {
					if (idKey.charAt(k) == idTarget.charAt(k)) {
                        matchesBuffer = matchesBuffer.concat(idKey.charAt(k));
					} else {
						misses++;
						if (misses > 1)
							break;
					}
                }
                
                if (misses == 1) { // found the match
                    console.log("Part B");
					console.log("Match found");
					console.log("id" + i + ": " + idKey);
                    console.log("id" + j + ": " + idTarget);
					console.log("matching chars: ", matchesBuffer);
                    
                    // lazy exit
					process.exit(1);
				}

			}
		}
    }
}

let solver = new Day2Solution();
solver.main();