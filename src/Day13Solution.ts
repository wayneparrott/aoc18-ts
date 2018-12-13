import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

// notes
// 1) from observation no vehicle starts on a turn
//
enum VehicleIntersectionChoice { LEFT, STRAIGHT, RIGHT };
enum VehicleDirection { WEST, EAST, NORTH, SOUTH }
class Vehicle {

    prevIntersectionDecision: VehicleIntersectionChoice;

    constructor(public id: string, public position: TrackPiece,
        public direction: VehicleDirection) {
        this.prevIntersectionDecision = VehicleIntersectionChoice.RIGHT;
    }

    move(track: Array<Array<TrackPiece>>) {
        if (!this.position) return; // check just in case
        if (this.isCollision()) return; // do nothing if already at a collision

        this.position.removeVehicle(this);

        let nextTrackPiece: TrackPiece;
        switch (this.direction) {
            case VehicleDirection.NORTH:
                nextTrackPiece = track[this.position.y - 1][this.position.x];
                if (nextTrackPiece.type == TrackPieceType.TURN) {
                    this.direction =
                        nextTrackPiece.ch == "/" ?
                            VehicleDirection.EAST : VehicleDirection.WEST;
                }
                break;


            case VehicleDirection.SOUTH:
                nextTrackPiece = track[this.position.y + 1][this.position.x];
                if (nextTrackPiece.type == TrackPieceType.TURN) {
                    this.direction =
                        nextTrackPiece.ch == "/" ?
                            VehicleDirection.WEST : VehicleDirection.EAST;
                }
                break;

            case VehicleDirection.EAST:
                nextTrackPiece = track[this.position.y][this.position.x + 1];
                if (nextTrackPiece.type == TrackPieceType.TURN) {
                    this.direction =
                        nextTrackPiece.ch == "/" ?
                            VehicleDirection.NORTH : VehicleDirection.SOUTH;
                }
                break;

            case VehicleDirection.WEST:
                nextTrackPiece = track[this.position.y][this.position.x - 1];
                if (nextTrackPiece.type == TrackPieceType.TURN) {
                    this.direction =
                        nextTrackPiece.ch == "/" ?
                            VehicleDirection.SOUTH : VehicleDirection.NORTH;
                }
                break;
        }

        //console.log("next track piece: ", nextTrackPiece);

        if (nextTrackPiece.type == TrackPieceType.INTERSECTION) {
            let intersectionDecision = this.nextIntersectionDecision();
            this.direction = this.transIntersectionChoiceToDirection(intersectionDecision);
            this.prevIntersectionDecision = intersectionDecision;
        }

        this.position = nextTrackPiece;
        nextTrackPiece.addVehicle(this);

        //console.log("moved: ", this);
    }

    transIntersectionChoiceToDirection(choice: VehicleIntersectionChoice): VehicleDirection {
        let newDirection: VehicleDirection;

        switch (choice) {
            case VehicleIntersectionChoice.STRAIGHT:
                newDirection = this.direction;
                break;
            case VehicleIntersectionChoice.LEFT:
                switch (this.direction) {
                    case VehicleDirection.NORTH:
                        newDirection = VehicleDirection.WEST;
                        break;
                    case VehicleDirection.SOUTH:
                        newDirection = VehicleDirection.EAST;
                        break;
                    case VehicleDirection.EAST:
                        newDirection = VehicleDirection.NORTH;
                        break;
                    case VehicleDirection.WEST:
                        newDirection = VehicleDirection.SOUTH;
                        break;
                }
                break;
            case VehicleIntersectionChoice.RIGHT:
                switch (this.direction) {
                    case VehicleDirection.NORTH:
                        newDirection = VehicleDirection.EAST;
                        break;
                    case VehicleDirection.SOUTH:
                        newDirection = VehicleDirection.WEST;
                        break;
                    case VehicleDirection.EAST:
                        newDirection = VehicleDirection.SOUTH;
                        break;
                    case VehicleDirection.WEST:
                        newDirection = VehicleDirection.NORTH;
                        break;
                }
                break;
        }

        return newDirection;
    }

    isCollision() {
        return !this.position || this.position.isCollision();
    }

    nextIntersectionDecision(): VehicleIntersectionChoice {
        let decision: VehicleIntersectionChoice;

        switch (this.prevIntersectionDecision) {
            case VehicleIntersectionChoice.LEFT:
                decision = VehicleIntersectionChoice.STRAIGHT;
                break;
            case VehicleIntersectionChoice.STRAIGHT:
                decision = VehicleIntersectionChoice.RIGHT;
                break;
            case VehicleIntersectionChoice.RIGHT:
                decision = VehicleIntersectionChoice.LEFT;
                break;
        }
        return decision;
    }
}

enum TrackPieceType { HORIZONTAL, VERTICAL, TURN, INTERSECTION, NULL };

class TrackPiece {
    type: TrackPieceType;
    vehicles: Array<Vehicle> = null;

    static charToTrackPieceType(ch: string): TrackPieceType {
        let tpt: TrackPieceType;
        switch (ch) {
            case '-':
            case '>':
            case '<':
                tpt = TrackPieceType.HORIZONTAL;
                break;
            case '|':
            case '^':
            case 'v':
            case 'V':
                tpt = TrackPieceType.VERTICAL;
                break;
            case '+':
                tpt = TrackPieceType.INTERSECTION;
                break;
            case '/':
            case '\\':
                tpt = TrackPieceType.TURN;
                break;
            default:
                tpt = TrackPieceType.NULL;
        }
        return tpt;
    }

    constructor(public ch: string, public x: number, public y: number) {
        this.vehicles = [];
        this.type = TrackPiece.charToTrackPieceType(ch);
    }

    isCollision(): boolean {
        return this.vehicles && this.vehicles.length > 1;
    }

    hasVehicle(): boolean {
        return this.vehicles && this.vehicles.length > 0;
    }

    addVehicle(newVehicle: Vehicle) {
        if (!this.vehicles) this.vehicles = [];
        this.vehicles.push(newVehicle);
    }

    removeVehicle(oldVehicle: Vehicle) {
        if (!this.vehicles) return;
        this.vehicles = this.vehicles.filter(vehicle => vehicle != oldVehicle);
    }

    removeAllVehicles() {
        this.vehicles = [];
    }

}

class Day13Solution extends AoCSolution {

    track: Array<Array<TrackPiece>>;
    vehicles: Array<Vehicle>;
    ticks: number;

    constructor() {
        super();
        this.options.aFilename = 'data/day13.dat';
        this.options.bFilename = 'data/day13.dat';
    }

    // answer (103,85)
    partA() {
        console.log("Part-A");
        this.track = [];
        this.vehicles = [];
        this.ticks = 0;

        this.loadData(this.options.aFilename);

        let collision = false;
        do {
            //console.log("tick: ", this.ticks);
            //this.displayTrack();

            collision = this.vehicles.reduce((prev, vehicle) => {
                return prev || vehicle.isCollision()
            }, false);
            
            this.tick();
        } while (!collision)

        let collisionVehicles = this.vehicles.filter(vehicle => vehicle.isCollision());

        console.log("collisions: ", collisionVehicles);
    }

    // answer  (88,64)
    partB() {
        console.log("Part-B");
        this.track = [];
        this.vehicles = [];
        this.ticks = 0;

        this.loadData(this.options.bFilename);

        do {
            //this.displayTrack();
            this.tick(true);
        } while (this.vehicles.length > 1 && this.ticks < 15)


        console.log("vehicle: ", this.vehicles);
    }

    tick(removeCollisions=false, stopWhenSingleVehicle=true) {

        this.vehicles.forEach(vehicle => {

            vehicle.move(this.track);
            if (removeCollisions && vehicle.isCollision()) {
                this.removeCollision(vehicle);
            }
        })
        
        if (stopWhenSingleVehicle && this.vehicles.length > 1) {
            //do not increment tick if stopping last vehicle from moving
            return;
        }

        this.ticks++;
    }

    removeCollision(vehicle: Vehicle) {
        if (!vehicle.position) return;
        let collisions = vehicle.position.vehicles;
        collisions.forEach(veh => {
            //remove vehicle form trackPiece.vehicles
            veh.position.removeAllVehicles();
            veh.position = null;
        });
        this.vehicles = this.vehicles.filter(
            vehicle => collisions.indexOf(vehicle) == -1);
    }


    isVehiclePiece(ch: string): boolean {
        return 'vV^<>'.indexOf(ch) >= 0;
    }

    charToVehicleDirection(ch: string): VehicleDirection {
        let direction: VehicleDirection;
        switch (ch) {
            case '^':
                direction = VehicleDirection.NORTH;
                break;
            case 'v':
            case 'V':
                direction = VehicleDirection.SOUTH;
                break;
            case '<':
                direction = VehicleDirection.WEST;
                break;
            case '>':
                direction = VehicleDirection.EAST;
                break;
            default:
                console.log("SCREWED: ", ch);
        }
        return direction;
    }

    loadData(filename: string) {
        let input: string[];
        input = loadFile(filename, AoCSolution.EOL);

        let y = 0;
        input.forEach(line => {
            let trackPieces = new Array<TrackPiece>(line.length).fill(null);
            for (let i = 0; i < line.length; i++) {
                let ch = line.charAt(i);
                let trackPiece = new TrackPiece(ch, i, y);
                trackPieces[i] = trackPiece;
                if (this.isVehiclePiece(ch)) {
                    let vehicle =
                        new Vehicle(this.vehicles.length.toString(), trackPiece,
                            this.charToVehicleDirection(ch));
                    trackPiece.addVehicle(vehicle);
                    this.vehicles.push(vehicle);

                    if (trackPiece.type == TrackPieceType.HORIZONTAL) {
                        trackPiece.ch = "-";
                    } else if (trackPiece.type == TrackPieceType.VERTICAL) {
                        trackPiece.ch = "|";
                    }
                }
            }
            this.track.push(trackPieces);
            y++;
        });

        console.log("track constructed, vehicles: ", this.vehicles.length);
        //console.log(this.vehicles);
    }

    displayTrack() {
        for (let i = 0; i < this.track.length; i++) {
            let line = "";
            for (let j = 0; j < this.track[i].length; j++) {
                let tp = this.track[i][j];
                let ch = tp.ch;
                if (tp.isCollision()) {
                    ch = 'X'
                } else if (tp.hasVehicle()) {
                    switch (tp.vehicles[0].direction) {
                        case VehicleDirection.NORTH:
                            ch = '^';
                            break;
                        case VehicleDirection.SOUTH:
                            ch = 'V';
                            break;
                        case VehicleDirection.EAST:
                            ch = '>';
                            break;
                        case VehicleDirection.WEST:
                            ch = '<';
                            break;
                    }
                }
                line += ch;
            }
            console.log(line);
        }
    }

}

let solver = new Day13Solution();
solver.main();

