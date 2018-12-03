
import * as fs from "fs";
import * as readline from "readline";

//warning shitty code. Emphasis on speed

class PartA {

    // answer 484
    main() {
        let myInterface = readline.createInterface({
            input: fs.createReadStream('data/day1-parta.dat')
        });

        let freq = 0;
        myInterface.on('line', (line) => {
            freq += parseInt(line);
        });

        myInterface.on('close', () => {
            console.log('freq: ', freq);
        });
    }
}

// let partA = new PartA();
// partA.main(); 


class PartB {
    //answer 367
    freq: number = 0;
    freqs: number[] = [];

    processFile(): void {

        console.log('processing file');

        let myInterface = readline.createInterface({
            input: fs.createReadStream('data/day1-parta.dat')
        });

        myInterface.on('line', (line) => {
            this.freq += parseInt(line);
            if (this.freqs.includes(this.freq)) {
                console.log('found: ', this.freq);
                process.exit(1); //lazy termination rather than design proper termination
            } else {
                this.freqs.push(this.freq);
            }
        });

        myInterface.on('close', () => {
            this.processFile();
        });
    }
}

let partB: PartB = new PartB();
partB.processFile();

