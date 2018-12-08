
export abstract class AoCSolution {

    // split patterns for use with loadFile()
    public static readonly EOL = "\n";
    public static readonly COMMA_WHITESPACE_EOL = /,\s*(\n?)/; 

    options: {
        a: boolean,
        aFilename?: string,
        b: boolean,
        bFilename?: string
    }

    constructor() {
        this.options = {
            a: false,
            b: false
        };
        let args = process.argv.slice(2);
        if (args.length > 0) {
            args.forEach(arg => {
                switch (arg) {
                    case '-a': this.options.a = true;
                        break;
                    case '-b': this.options.b = true;
                        break;
                }
            });
        } else { //default is to run both partA() and partB()
            this.options.a = true;
            this.options.b = true;
        }
    };

    main() {
        if (this.options.a) this.partA();
        if (this.options.b) this.partB();
    }

    abstract partA(): void;

    abstract partB(): void;
}


// example subclass
// import { AoCSolution } from "./AoCSolution";
//
// class DayXSolution extends AoCSolution {
// 
//     constructor() {
//         super();
//          this.options.aFilename = 'dayx-parta.dat';
//          this.options.bFilename = 'dayx-partb.dat';
//     }
// 
//      // answer 
//     partA() {
//         let input: string[];
//         input = loadFile(this.options.aFilename, AoCSolution.EOL);
// 
//     }
//      // answer  
//     partB() {
//         let input: string[];
//         input = loadFile(this.options.bFilename, AoCSolution.EOL);
// 
//     }
// }
// 
// let solver = new DayXSolution();
// solver.main();

