import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

enum CellContent { CLAY = -1, SAND = 0, WATER = 1, SPRING = 2 };


// While this algo solves the part-A test data it does 
// not correctly compute part-A solution with the full data. 
// My algo is an experiment that searchs down vertically until
// it runs out of bounds or hits clay. If it hits clay then
// fill in the occupied space of sand until it overflows. Then
// for each overflow location repeat searching down and filling.
// Thought this was clever except for my recursive algo is exceeding
// the max stack which typically indicates that an endless recursion cycle
// of some sort.
class Day17Solution extends AoCSolution {

    constructor() {
        super();
        this.options.aFilename = 'data/day17-test.dat';
        this.options.bFilename = 'data/day17-test.dat';
    }

    // 6276 too low 
    partA() {
        console.log("Part-A");

        let spring = [500, 0];

        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);

        let clayCoords: {
            x: [number, number],
            y: [number, number]
        }[] = [];

        // y=966, x=475..477
        // y=1193, x=518..533
        input.forEach(line => {
            let match = /(\w)=(\d+),\s+(\w)=(\d+)..(\d+)/gm.exec(line);
            let [, var1, val1, var2, var2start, var2end] = match;
            let xstart, xend, ystart, yend: number;
            if (var1 == 'x') {
                xstart = parseInt(val1);
                xend = xstart;
                ystart = parseInt(var2start);
                yend = parseInt(var2end)
            } else {
                ystart = parseInt(val1);
                yend = ystart;
                xstart = parseInt(var2start);
                xend = parseInt(var2end)
            }

            clayCoords.push(
                {
                    x: [xstart, xend],
                    y: [ystart, yend]
                }
            )
        });

        let xPadding = 10;

        let xmin = clayCoords.reduce((prevMin, coord) =>
            Math.min(prevMin, coord.x[0])
            , Number.MAX_SAFE_INTEGER) - xPadding; //pad 100 cells to left
        let xmax = clayCoords.reduce((prevMin, coord) =>
            Math.max(prevMin, coord.x[1])
            , Number.MIN_SAFE_INTEGER) + xPadding; //pad 100 cell to right
        let ymin = 0;
        let ymax = clayCoords.reduce((prevMin, coord) =>
            Math.max(prevMin, coord.y[1])
            , Number.MIN_SAFE_INTEGER);

        //build grid
        let width = xmax - xmin;
        let ht = ymax - ymin + 1;

        console.log("xmin: ", xmin, " xmax: ", xmax, " ymin: ", ymin, " ymax: ", ymax);
        console.log("ht: ", ht, " width: ", width);

        let grid = new Array<number>(ht).fill(null).map(row => new Array(width).fill(CellContent.SAND));

        //fill grid with clay data
        clayCoords.forEach(coord => {
            //console.log("clay: ", coord);
            for (let y = coord.y[0]; y <= coord.y[1]; y++) {
                for (let x = coord.x[0]; x <= coord.x[1]; x++) {
                    grid[y][x - xmin] = CellContent.CLAY;
                    //console.log("set clay: ", y, x, grid[y][x - xmin]);
                }
            }
        });

        grid[spring[1]][spring[0] - xmin] = CellContent.SPRING;

        //console.log(grid);
        let curX = spring[0] - xmin;
        let curY = 1;

        this.flow(curX, curY, grid);

        let answer = 0;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                answer += grid[i][j] == CellContent.WATER ? 1 : 0;
            }
        }
        console.log("answer: ", answer);
        this.display(grid);
    }

    // answer  
    partB() {
        console.log("Part-B");

        let input: string[];
        input = loadFile(this.options.bFilename, AoCSolution.EOL);

    }

    flow(x: number, y: number, grid: Array<Array<number>>) {
        this.flowVert(x, y, grid);
    }

    flowVert(x: number, y: number, grid: Array<Array<number>>) {
        console.log("vert", x, y);
        while (y < grid.length && grid[y][x] != CellContent.CLAY) {
            grid[y][x] = CellContent.WATER;
            y++
        }
        if (y < grid.length) {
            this.flowFill(x, y - 1, grid);
        }
    }

    flowFill(x: number, y: number, grid: Array<Array<number>>) {
        console.log("fill", x, y);
        let updated = false;
        if (y == 0 || y + 1 >= grid.length) {
            //not fillable
            return;
        }
        //flow left 
        let curX = x - 1;
        while (curX >= 0 && grid[y][curX] != CellContent.CLAY && grid[y + 1][curX] != CellContent.SAND) {
            grid[y][curX] = CellContent.WATER;
            curX--;
        }
        let leftOverFlow =
            curX >= 0 &&
            grid[y][curX] == CellContent.SAND &&
            grid[y + 1][curX + 1] == CellContent.CLAY;

        if (leftOverFlow) {
            grid[y][curX] = CellContent.WATER;
            console.log("LO")
            this.flowVert(curX, y, grid);
        }

        updated = curX-1 != x;

        //flow right
        curX = x + 1;
        while (curX < grid[0].length && grid[y][curX] != CellContent.CLAY && grid[y + 1][curX] != CellContent.SAND) {
            grid[y][curX] = CellContent.WATER;
            curX++;
        }
        let rightOverFlow =
            curX < grid[0].length &&
            //grid[y][curX] != CellContent.CLAY &&
            grid[y][curX] == CellContent.SAND &&
            grid[y + 1][curX - 1] == CellContent.CLAY;

        if (rightOverFlow) {
            grid[y][curX] = CellContent.WATER;
            console.log("RO");
            this.flowVert(curX, y, grid);
        }

        updated = updated || curX+1 == x;
        //if (!updated) return;

        if (!leftOverFlow && !rightOverFlow) {
            this.flowFill(x, y - 1, grid);
        }
    }

    display(grid: Array<Array<number>>) {
        for (let y = 0; y < grid.length; y++) {
            let line: string = "";
            for (let x = 0; x < grid[0].length; x++) {
                switch (grid[y][x]) {
                    case CellContent.CLAY:
                        line += '#';
                        break;
                    case CellContent.SAND:
                        line += '.';
                        break;
                    case CellContent.WATER:
                        line += '~';
                        break;
                    case CellContent.SPRING:
                        line += '+';
                        break;
                }
            }
            console.log(line);
        }
    }
}

let solver = new Day17Solution();
solver.main();

