import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

interface Computation {
    id: number
    opCode: number,
    A: number,
    B: number,
    C: number,
    inputRegs: number[],
    outputRegs: number[],
    instructIds: string[]
};

interface Operation {
    opCode: number,
    name: string,
    execute: (A: number, B: number, C: number, registers: number[]) => void
}

class Day16Solution extends AoCSolution {

    operations: {
        ops: Operation[],
        nameMap: Map<string, Operation>,
        idMap: Map<number, Operation>
    } =
        {
            ops: [],
            nameMap: new Map(),
            idMap: new Map()
        };

    samples: Computation[] = [];

    constructor() {
        super();
        this.options.aFilename = 'data/day16.dat';
        this.options.bFilename = 'data/day16-partb.dat';

        //this.opCodesDict = new Map();
        this.createOperations();
    }

    // answer: 612
    partA() {
        console.log("Part-A");
        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);

        for (let i = 0; i < input.length; i++) {
            //parse inputRegs
            let match = /Before: \[(\d), (\d), (\d), (\d)\]/gm.exec(input[i * 4]);
            if (!match) break;

            let inputRegs = match.slice(1).map(ch => Number(ch));

            //parse instruct
            let instructionArgs = input[i * 4 + 1].split(' ').map(ch => Number(ch));
            let [opCode, A, B, C] = instructionArgs;

            //parse outputRegs
            match = /After:  \[(\d), (\d), (\d), (\d)\]/gm.exec(input[i * 4 + 2]);
            let outputRegs = match.slice(1).map(ch => Number(ch));

            this.samples.push({
                id: i,
                opCode: opCode,
                A: A,
                B: B,
                C: C,
                inputRegs: inputRegs,
                outputRegs: outputRegs,
                instructIds: []
            });

            //console.log(computations);
        }

        console.log("computations read: ", this.samples.length);

        // for each computation, determine the potential instructions 
        // that could have created the output for a given input

        this.samples.forEach(computation => this.analyze(computation));

        // collect the computations w/ instructIds.len >= 3
        let results: Computation[] =
            this.samples.filter(computation =>
                computation.instructIds.length >= 3);

        console.log("answer: ", results.length);
        //console.log(results);
    }

    // answer: 485
    partB() {
        console.log("Part-B");

        this.resolveOpCodes();

        let input: string[];
        input = loadFile(this.options.bFilename, AoCSolution.EOL);

        // load instructions
        let program = new Array<Array<number>>();
        program = input.map(line => line.split(' ').map(num => Number(num)));


        let registers = [0,0,0,0];
        program.forEach( instruction => {
            let operation = this.operations.idMap.get(instruction[0]);
            if (!operation) console.log("no op found for opcode: ", instruction);
            (operation.execute)(instruction[1],instruction[2],instruction[3],registers);
        });
        
        console.log("register[0]: ", registers[0]);
    }

    resolveOpCodes() {
        //loop until samples is empty
        let max = 0;
        do {
            let singleOpComputations =
                this.samples.filter(computation => computation.instructIds.length == 1);

            if (singleOpComputations.length == 0) {
                console.log("NO SINGLE COMPUTATIONS FOUND");
                break;
            }

            let computation = singleOpComputations[0];
            let opName = computation.instructIds[0];
            if (!opName || this.operations.nameMap.get(opName).opCode > -1) {
                // opCode already known
                continue;
            }

            let operation = this.operations.nameMap.get(opName);
            operation.opCode = computation.opCode;
            this.operations.idMap.set(operation.opCode,operation);
            console.log(`found: ${operation.name}=${operation.opCode}`);

            //remove all samples having this known opCode
            this.samples = this.samples.filter(computation =>
                computation.opCode != operation.opCode)

            //remove opName from all computation.instructIds
            this.samples.forEach(computation => {
                computation.instructIds =
                    computation.instructIds.filter(name => name != operation.name)
            });

            max++;
        
        } while (this.samples.length > 0)
    }


    analyze(computation: Computation) {
        this.operations.ops.forEach((op, idx) => {
            //apply operation to registers
            let registers = computation.inputRegs.slice();
            (op.execute)(computation.A, computation.B, computation.C, registers);

            //compare registers to computation.outReg
            let found = true;
            for (let i = 0; i < 4 && found; i++) {
                found = registers[i] == computation.outputRegs[i];
            }

            if (found) {
                computation.instructIds.push(op.name);
            }
        });
    }

    createOperations() {
        let operation: Operation;

        operation = {
            opCode: -1,
            name: "addr",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] + registers[B];
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "addi",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] + B;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "mulr",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] * registers[B];
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "muli",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] * B;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "banr",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] & registers[B];
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "bani",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] & B;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "borr",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] | registers[B];
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "bori",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] | B;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "setr",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A];
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "seti",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = A;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "gtir",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = A > registers[B] ? 1 : 0;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "gtri",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] > B ? 1 : 0;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "gtrr",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] > registers[B] ? 1 : 0;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "eqir",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = A == registers[B] ? 1 : 0;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "eqri",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] == B ? 1 : 0;
            }
        };
        this.operations.ops.push(operation);

        operation = {
            opCode: -1,
            name: "eqrr",
            execute: (A: number, B: number, C: number, registers: number[]) => {
                registers[C] = registers[A] == registers[B] ? 1 : 0;
            }
        };
        this.operations.ops.push(operation);

        this.operations.ops.map(op => {
            this.operations.nameMap.set(op.name, op);
        });

        console.log(this.operations.nameMap);
    }
}

let solver = new Day16Solution();
solver.main();