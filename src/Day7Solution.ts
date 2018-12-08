import { AoCSolution } from "./AoCSolution";
import { loadFile } from "./Utils";

// Node is an alias for "task" in the problem statement.
// Initially I thought this was a graph search problem but nope.
// Thus the terminology for node, children, parents, ... which I
// would design a bit differently now that I "get" the problem.
class Node {
    parents: Node[];
    children: Node[];

    constructor(public id: string) {
        this.parents = new Array<Node>();
        this.children = new Array<Node>();
    }

    isRunnable(): boolean {
        return !this.hasParents();
    }

    hasChildren(): boolean {
        return this.children.length == 0;
    }

    addChild(child: Node) {
        this.children.push(child);
        this.children.sort(
            (a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
    }

    hasParents(): boolean {
        return this.parents.length > 0;
    }

    addParent(parent: Node) {
        this.parents.push(parent);
        this.parents.sort(
            (a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
    }

    removeParent(parent: Node) {
        this.parents = this.parents.filter(node => node != parent);
    }
}

class WorkQueue {


    nodes: Node[];

    constructor() {
        this.nodes = [];
    }

    size(): number {
        return this.nodes.length;
    }

    addNode(node: Node) {
        this.nodes.push(node);
        this.nodes.sort(
            (a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
    }

    removeNode(rmNode: Node) {
        this.nodes = this.nodes.filter(node => node != rmNode);
    }

    isEmpty(): boolean {
        return this.nodes.length == 0;
    }

    next(): Node {
        if (this.isEmpty()) return null;

        let nextNode: Node = null;
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].isRunnable()) {
                nextNode = this.nodes[i];
                this.removeNode(nextNode);
                break;
            }
        }

        return nextNode;
    }
}

class Worker {
    static BASE_TIME = 60;
    static CHAR_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    timeRemaining: number;
    node: Node;

    constructor() {
    }

    assignNode(node: Node) {
        this.node = node;
        this.timeRemaining = Worker.BASE_TIME + Worker.CHAR_TABLE.indexOf(node.id) + 1;
    }

    tick() {
        if (!this.isWorking()) return;
        this.timeRemaining--;
    }

    isWorking(): boolean {
        return this.timeRemaining > 0;
    }


}


class Day7Solution extends AoCSolution {

    nodes: { [id: string]: Node } = {};
    workQueue: WorkQueue;
    order: string;
    workers: Worker[];

    constructor() {
        super();
        this.options.aFilename = 'data/day7.dat';
        this.options.bFilename = 'data/day7-test.dat';
        this.workQueue = new WorkQueue();
    }

    // answer: IJLFUVDACEHGRZPNKQWSBTMXOY
    partA() {
        this.workQueue = new WorkQueue();
        this.loadInput(this.options.aFilename);
        this.initWorkQueue();


        console.log("init work queue sz: ", this.workQueue.size());
        this.order = "";
        while (!this.workQueue.isEmpty()) {
            let curNode = this.workQueue.next();
            this.order += curNode.id;

            //this node is complete
            //add all of curNode children to workqueue
            //remove it from all of it's children's parent list
            curNode.children.forEach(node => {
                this.workQueue.addNode(node);
                node.removeParent(curNode)
            });
        }

        console.log('answer: ', this.order);

    }


    // answer: 1072
    partB() {
        this.nodes = {};
        this.workQueue = new WorkQueue();
        
        this.loadInput(this.options.aFilename);
        this.initWorkQueue();

        let timer = 0;
        this.order = "";

        this.workers = [];
        let workerCnt = 5;
        for (let i = 0; i < workerCnt; i++) {
            this.workers.push(new Worker());
        }

        console.log("init workqueue: ", this.workQueue.size());

        do {
            //assign idle workers
            for (let i = 0; i < this.workers.length; i++) {
                let worker: Worker = this.workers[i];
                if (!worker.isWorking()) {
                    let node = this.workQueue.next();
                    if (!node) break;
                    worker.assignNode(node);
                    
                    //console.log("assigned node to Worker: ", node);
                }
            }

            // apply tick
            for (let i = 0; i < this.workers.length; i++) {
                let worker: Worker = this.workers[i];
                //console.log("tick: ", timer, " - ",worker.node);
                if (worker.isWorking()) {
                    worker.tick();
                    //console.log("apply tick: ", worker.node.id);
                    if (!worker.isWorking()) { //just finished
                        //update workqueue with children of finished worker.node
                        //this node is complete
                        //add all of curNode children to workqueue
                        //remove it from all of it's children's parent list
                        worker.node.children.forEach(node => {
                            this.workQueue.addNode(node);
                            node.removeParent(worker.node);
                        });
                    }
                }
            }

            timer++;

        } while (this.hasActiveWorkers() || !this.workQueue.isEmpty())


        console.log('answer: ', timer);

    }

    loadInput(filename: string) {
        let input: string[];
        input = loadFile(filename, AoCSolution.EOL);

        input.forEach(line => {
            const regex = /^Step (\w+) must be finished before step (\w+) can begin\./gm;
            let match = regex.exec(line);

            let fromNode = this.findNode(match[1]);
            let toNode = this.findNode(match[2]);

            fromNode.addChild(toNode);
            toNode.addParent(fromNode);
        });
    }

    initWorkQueue() {
        //let root = new Node("ROOT:");
        console.log("find root");
        for (let prop in this.nodes) {
            let node = this.nodes[prop];
            if (!node.hasParents()) {
                console.log("no parents: ", node.id);
                this.workQueue.addNode(node);
            }
        };
    }

    findNode(id: string) {
        if (!this.nodes.hasOwnProperty(id)) {
            this.nodes[id] = new Node(id);
        }
        return this.nodes[id];
    }

    hasActiveWorkers(): boolean {
        return this.workers.reduce((prevWorking, worker) => worker.isWorking() || prevWorking, false);
    }

}

let solver = new Day7Solution();
solver.main();