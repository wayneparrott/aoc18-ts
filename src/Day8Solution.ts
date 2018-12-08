import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

class Node {
    value: number;
    children: Node[];
    metadata: number[];

    constructor() {
        this.children = [];
        this.metadata = [];
    }

    localSumMetaData(): number {
        return this.metadata.reduce((total, mdata) => total + mdata, 0);
    }

    partAComputeValue(): number {
        return this.localSumMetaData() +
            this.children.reduce((total, node) => { return total + node.partAComputeValue() }, 0);
    }

    partBComputeValue(): number {
        return this.children.length == 0 ?
            this.localSumMetaData() :
            this.metadata.reduce((tot: number, childIdx: number) => {
                if (childIdx > this.children.length) {
                    return tot;
                } else {
                    return tot + this.children[childIdx - 1].partBComputeValue();
                }
            }, 0);
    }
}

class Day8Solution extends AoCSolution {

    root: Node;

    constructor() {
        super();
        this.options.aFilename = 'data/day8.dat';
        this.options.bFilename = 'data/day8.dat';
        this.init();
    }

    init() {
        this.loadInput(this.options.aFilename);
    }

    // answer: 36627
    partA() {
        let total = this.root.partAComputeValue();
        console.log("Part-A: ", total);
    }

    // answer: 16695
    partB() {
        let total = this.root.partBComputeValue();
        console.log("Part-B: ", total);
    }

    loadInput(filename: string) {
        let input: string[];
        input = loadFile(filename, AoCSolution.EOL);
        let data = input[0].split(' ').map(element => Number(element));
        this.root = this.buildTree(data);

        //console.log("root: ", this.root);
    }

    buildTree(data: number[]): Node {

        let node: Node = new Node();
        let childrenCnt = data.shift();
        let metaDataCnt = data.shift();

        for (let i = 0; i < childrenCnt; i++) {
            node.children.push(this.buildTree(data));
        }

        for (let i = 0; i < metaDataCnt; i++) {
            node.metadata.push(data.shift().valueOf());
        }

        return node;
    }

}

let solver = new Day8Solution();
solver.main();
