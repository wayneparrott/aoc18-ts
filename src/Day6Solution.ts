import { AoCSolution } from "./AoCSolution";

class Day6Solution extends AoCSolution {

    places: {
            id: string,
            x: number,
            y: number,
            cellCnt: number,
            exterior: boolean
        }[];
        
        maxx: number;
        maxy: number;

        displayGrid = false;

    constructor() {
        super();
         this.options.aFilename = 'data/day6-parta.dat';
         this.options.bFilename = 'data/day6-parta.dat';
    }

     // answer: 5975
     // todo: an exhaustive search,
     //    1) take do not consider places marked as exterior
     //    2) don't process cells on the border (external)
    partA() {
        
        this.init();

        for (let y=0; y <= this.maxy; y++) {
            let str = "";
            for (let x=0; x <= this.maxx; x++) {
                
                let cell2PlaceDistance: { distance: number, place: any}[] = [];
               
                // calc manhattan dist from cell to each place
                this.places.forEach(place => {
                    let dist = Math.abs(x-place.x) + Math.abs(y-place.y);
                    //console.log('dist: ', dist);
                     cell2PlaceDistance.push({distance: dist, place: place});
                });

                //sort distances in ascending order
                cell2PlaceDistance.sort(
                    (a, b) => {
                        return a.distance - b.distance
                    }
                )

                let minDistance = cell2PlaceDistance[0];

                if (minDistance.place.exterior) {
                    continue;
                }

                // check for Tie
                if (cell2PlaceDistance.length > 1) {
                    if (cell2PlaceDistance[1].distance == minDistance.distance) {
                        // Tie
                        str += '.';
                        continue;
                    }
                } 

                if (minDistance.distance == 0) {
                    str += minDistance.place.id;
                    continue;
                }

                // check for infinite (i.e., exterior cell)
                if (x == 0 || y == 0 || x == this.maxx || y == this.maxy) {
                    minDistance.place.exterior = true;
                    continue;
                }

                // all good, update place.cellCnt
                minDistance.place.cellCnt++;
                str += minDistance.place.id;
            }

            if (this.displayGrid) console.log('str: ', str);
        }

        let interiorPlaces = this.places.filter(place => !place.exterior);

        let maxPlace = interiorPlaces.reduce( (max,place) => { 
            return max.cellCnt > place.cellCnt ? max : place
        });

        console.log("Part-A");
        console.log("max place: ", maxPlace);
        //console.log(this.places);
    }

     // answer  38670
    partB() {
        const maxDist = 10000;

        this.init();

        let safeCellCnt = 0;
        for (let y=0; y <= this.maxy; y++) {
            let str = "";
            for (let x=0; x <= this.maxx; x++) {
                
                let dist = this.places.reduce( (total,place)  => 
                    total + Math.abs(x-place.x) + Math.abs(y-place.y),
                    0
                );

                if (dist < maxDist) {
                    str += "#";
                    safeCellCnt++;
                } else {
                    str += ".";
                }
            }
            if (this.displayGrid) console.log(str);
        }
        console.log("Part-B");
        console.log("answer: ", safeCellCnt);
    }

    init() : void {
        this.places = [];
        this. maxx = 0;
        this.maxy = 0;

        let input: string[];
        input = AoCSolution.loadFile(this.options.aFilename, AoCSolution.EOL);

        for (let i=0; i < input.length; i++) {
            const regex = /^(\d+), (\d+)\s*\n?/gm;
            let match = regex.exec(input[i]);

            let x = parseInt(match[1]);
            let y = parseInt(match[2]);
            this.maxx = Math.max(this.maxx,x);
            this.maxy = Math.max(this.maxy,y);
            this.places.push( {
                id: i.toString(),
                cellCnt: 1,
                x: x, 
                y: y,
                exterior: false
            });
        }
    }
}

let solver = new Day6Solution();
solver.main();