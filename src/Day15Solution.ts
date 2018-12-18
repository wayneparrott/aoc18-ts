import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

enum PlayerType { ELF, GOBBLIN };

class Player {

    constructor(public id: string, public type: PlayerType,
        public location: [number, number], public power: number = 200) {

    }

    isAlive() {
        return this.power > 0;
    }

    isEnemy(otherPlayer: Player): boolean {
        return this.type != otherPlayer.type;
    }
}

class Cell {
    type: number;
    player? :Player
}

class Day15Solution extends AoCSolution {

    constructor() {
        super();
        this.options.aFilename = 'data/day15-test.dat';
        this.options.bFilename = 'data/day15-test.dat';
    }

    // answer 
    partA() {
        console.log("Part-A");
        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);

    }
    // answer  
    partB() {
        console.log("Part-B");
        let input: string[];
        input = loadFile(this.options.bFilename, AoCSolution.EOL);

    }
}

let solver = new Day15Solution();
solver.main();