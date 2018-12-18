import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

enum CellContent { OPEN = 1, TREE, MILL };

class Day18Solution extends AoCSolution {

    grid: Array<Array<number>>;

    constructor() {
        super();
        this.options.aFilename = 'data/day18.dat';
        this.options.bFilename = 'data/day18-test.dat';
    }

    // answer: 675100
    partA() {
        console.log("Part-A");

        this.loadInput();
        let maxGenerations = 10;

        for (let gen = 1; gen <= maxGenerations; gen++) {
            this.grid = this.sim(this.grid);
        }

        let summary = this.computeSummary(this.grid);

        let answer =
            summary.get(CellContent.TREE) *
            summary.get(CellContent.MILL);

        console.log("answer: ", answer);
    }


    // answer: 191820
    // I ran 1000 iterations and noticed after about
    // 500 iterations the tree & mill counts repeated ever
    // 28 generations. Optimized for repeating state.
    // Did not peek at redis solutions; purely my own.
    partB() {
        console.log("Part-B");
        this.loadInput();

        let base = 1000; //run this many iterations to ensure data is repeating
        let maxGenerations = 1000000000;
        let repeatFreq = 28;
        
        maxGenerations = base + (maxGenerations-base) % repeatFreq;

        for (let gen = 1; gen <= maxGenerations; gen++) {
            this.grid = this.sim(this.grid);
        }

        let summary = this.computeSummary(this.grid);

        let answer =
            summary.get(CellContent.TREE) *
            summary.get(CellContent.MILL);

        console.log("answer: ", answer);

    }

    loadInput() {
        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);

        let width = input[0].length;
        let ht = input.length;

        this.grid = new Array<number>(ht + 2).fill(null).map(row => new Array(width + 2).fill(0));


        input.forEach((line, i) => {
            line.split('').forEach((ch, j) => {
                switch (ch) {
                    case '.':
                        this.grid[i + 1][j + 1] = CellContent.OPEN;
                        break;
                    case '|':
                        this.grid[i + 1][j + 1] = CellContent.TREE;
                        break;
                    case '#':
                        this.grid[i + 1][j + 1] = CellContent.MILL;
                        break;
                }
            })
        })
    }

    sim(grid: Array<Array<number>>): Array<Array<number>> {
        let width = grid[0].length;
        let ht = grid.length;
        let nextGrid = new Array<number>(ht).fill(null).map(() => new Array(width).fill(0));

        let newCellContent: CellContent;

        //skip processing top & bottom rows, skip first & last column
        for (let i = 1; i < ht - 1; i++) {
            for (let j = 1; j < width - 1; j++) {

                let adjacent: Map<number, number> = this.computeAdjacent(i, j, grid);
                let cell = grid[i][j];

                switch (cell) {
                    case CellContent.OPEN:
                        newCellContent = adjacent.get(CellContent.TREE) >= 3 ?
                            CellContent.TREE : CellContent.OPEN;
                        break;

                    case CellContent.TREE:
                        newCellContent = adjacent.get(CellContent.MILL) >= 3 ?
                        CellContent.MILL : CellContent.TREE;
                        break;

                    case CellContent.MILL:
                        newCellContent =
                            ((adjacent.get(CellContent.MILL) >= 1 &&
                             adjacent.get(CellContent.TREE) >= 1)) ?
                            CellContent.MILL : CellContent.OPEN;
                        break;

                    default:
                        console.log("xxxx")
                }

                nextGrid[i][j] = newCellContent;
            }
        }

        //this.display(nextGrid);
        return nextGrid;
    }

    computeSummary(grid: Array<Array<number>>): Map<number,number> {
        let summary: Map<number, number> = this.createSummaryMap();
        grid.reduce((summary: Map<number, number>, row: Array<number>) => {

            row.reduce((summary: Map<number, number>, cell: number) => {
                let cnt = summary.get(cell);
                summary.set(cell, cnt+1);
                return summary;
            }, summary);

            return summary;
        }, summary);

        return summary;
    }

    // assume i & j are never the top, bottom rows or left or right columns
    computeAdjacent(i: number, j: number, grid: Array<Array<number>>): Map<number, number> {
        let summary = this.createSummaryMap();
        let width = grid[0].length;
        let ht = grid.length;

        // row above cell
        for (let m = i - 1; m <= i + 1; m++) {
            for (let n = j - 1; n <= j + 1; n++) {
                if (m == i && n == j) continue;
                let cell = grid[m][n];
                let cnt = summary.get(cell);
                summary.set(cell, cnt + 1);
            }
        }

        return summary;
    }

    createSummaryMap(): Map<number, number> {
        let summary = new Map<number, number>();
        summary.set(CellContent.OPEN, 0);
        summary.set(CellContent.TREE, 0);
        summary.set(CellContent.MILL, 0);
        return summary;
    }

    display(grid: Array<Array<number>>) {
        let ht = grid.length;
        let width = grid[0].length;
        for (let i = 1; i < ht-1; i++) {
            let line = "";
            for (let j = 1; j < width-1; j++) {
                switch (grid[i][j]) {
                    case CellContent.OPEN:
                        line += '.';
                        break;
                    case CellContent.TREE:
                        line += '|';
                        break;
                    case CellContent.MILL:
                        line += '#';
                        break;
                    default:
                        line += '0';
                }
            }
            console.log(line);
        }
    }
}

let solver = new Day18Solution();
solver.main();