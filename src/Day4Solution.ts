import { AoCSolution } from "./AoCSolution";
import {loadFile} from "./Utils";

enum ObservationType { START_SHIFT = 1, ASLEEP = 2, AWAKE = 3 };

class Day4Solution extends AoCSolution {

    guards: {
        [id: number]: {
            intervals: [{
                asleep: number, //min of hour
                awake: number   //min of hour
                total: number
            }],
            total: number,
            freq: number[]
        }
    } = [];

    constructor() {
        super();
        this.options.aFilename = 'data/day4-parta.dat';
    }


    // max sleep pt 43
    // answer:  65489
    partA() {
        let input: string[];
        input = loadFile(this.options.aFilename, AoCSolution.EOL);

        let observations: {
            datetime: number,
            min: number,
            id?: number,
            type: ObservationType
        }[] = [];

        input.forEach(entry => {

            // example input
            // [1518-11-01 00:00] Guard #10 begins shift
            // [1518-11-01 00:05] falls asleep
            // [1518-11-01 00:25] wakes up
            // assume year is constant
            // create sortable entries 11010000->{number|f|w}
            const regex = /^\[\d{4}\-(\d{2}).(\d{2})\s(\d{2}):(\d{2})]\s(\w)\w+\s.(\d+)?/gm;

            let match = regex.exec(entry);
            // concat date-timestamp to create a sortable numeric value
            let observation: any = {};
            observation["datetime"] = parseInt(match[1] + match[2] + match[3] + match[4]);
            observation["min"] = match[4];
            let type: ObservationType;
            switch (match[5]) {
                case "G":
                    observation["type"] = ObservationType.START_SHIFT;
                    observation["id"] = parseInt(match[6]);
                    break;
                case "f":
                    observation["type"] = ObservationType.ASLEEP;
                    break;
                case "w":
                    observation["type"] = ObservationType.AWAKE;
                    break;
            }

            observations.push(observation);
        });

        // sort observations by dts in ascending order
        observations.sort((o1, o2) => (o1.datetime > o2.datetime) ? 1 : ((o2.datetime > o1.datetime) ? -1 : 0));

        // build sleep intervals for each guard
        let curGuard: any;
        let curInterval: any;
        for (let i = 0; i < observations.length; i++) {
            let observation = observations[i];
            switch (observation.type) {
                case ObservationType.START_SHIFT:
                    if (observation.id in this.guards === false) {
                        curGuard = {
                            id: observation.id,
                            total: 0,
                            intervals: []
                        };
                        this.guards[curGuard.id] = curGuard;
                        curInterval = {};
                    } else {
                        curGuard = this.guards[observation.id];
                    }

                    break;
                case ObservationType.ASLEEP:
                    curInterval = {
                        asleep: observation.min
                    };
                    break;
                case ObservationType.AWAKE:
                    curInterval.awake = observation.min;
                    curInterval.total = curInterval.awake - curInterval.asleep;
                    curGuard.intervals.push(curInterval);
                    curGuard.total += curInterval.total;
                    break;
            }
        }

        // find the Guard with the greats sleep time
        let laziestGuard: any;
        for (let id in this.guards) {
            let guard = this.guards[id];
            if (!laziestGuard) {
                laziestGuard = guard;
                continue
            }
            if (guard.total > laziestGuard.total) {
                laziestGuard = guard;
            }
        };

        // console.log('laziest guard: ', laziestGuard.id);
        // console.log('total: ', laziestGuard.total);

        // compute most frequent sleep time
        // build a frequency table for mins [0-59]
        let freq: number[] = new Array<number>(60).fill(0);
        for (let i = 0; i < freq.length; i++) {
            let intervals = laziestGuard.intervals;
            intervals.forEach(interval => {
                for (let j = interval.asleep; j < interval.awake; j++) {
                    freq[j]++
                }
            })
        }

        let maxMin = 0;
        let max = 0;
        for (let i = 0; i < freq.length; i++) {
            if (freq[i] > max) {
                max = freq[i];
                maxMin = i;
            }
        }
        console.log('Part-A');
        console.log('max sleep pt', maxMin);
        console.log('answer: ', (maxMin * laziestGuard.id));
        console.log();
    }


    // Part-B
    // consistent guard:  107
    // max freq:  16
    // minute:  36
    // answer:  3852
    partB() {
        // build a frequency table for mins [0-59] for every guard
        for (let id in this.guards) {
            let guard = this.guards[id];
            let freq: number[] = new Array<number>(60).fill(0);
            let intervals = guard.intervals;
            intervals.forEach(interval => {
                // console.log('interval: [', interval.asleep, '-', interval.awake, ']');
                for (let i = interval.asleep; i < interval.awake; i++) {
                    freq[i]++;
                }
            })

            guard.freq = freq;
        };

        let maxGuard: any;
        let maxMinute = 0;
        let maxFreqValue = 0;
        for (let i = 0; i < 60; i++) {
            for (let id in this.guards) {
                let guardx = this.guards[id];
                let freq = guardx.freq;
                if (freq[i] > maxFreqValue) {
                    maxGuard = guardx;
                    maxMinute = i;
                    maxFreqValue = freq[i];
                }
            }
        }
            console.log('Part-B');
            console.log('consistent guard: ', maxGuard.id);
            console.log('max freq: ', maxFreqValue);
            console.log('minute: ', maxMinute);
            console.log('answer: ', (maxGuard.id * maxMinute));
        }
    }

let solver = new Day4Solution();
solver.main();