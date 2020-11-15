console.log("Starting");

let myGrid = {
    setArea: function () { this.area = parseInt(document.getElementById("area").value) },
    grid: null,
    start: null,
    end: null,
    gridSize: null,
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isObstacle = false;
        this.visited = false;
        this.GlobalGoal = null;
        this.LocalGoal = null;
        this.neighbours = [];
        this.parent = null;
    }
}

function setUpGrid() {
    // canvas is made up of a 2d array with each position being a node.

    // create a grid to hold the nodes
    // grid shape in an array
    // [
    //     [x, x, x],
    //     [x, x, x],
    //     [x, x, x]
    // ]

    const gridHeight = myGrid.area;
    const gridWidth = myGrid.area;
    let grid = Array.from(Array(gridWidth), () => new Array(gridHeight));

    // populate with nodes
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            let newNode = new Node(x, y);
            grid[x][y] = newNode;
        }
    }

    //create connections to every neighbouring nodes
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            // if not at the left end, add the previous node to the left
            if (y > 0) {
                grid[x][y].neighbours.push(grid[x][y - 1]);
            }
            // if not at the right end, add the next node to the right
            if (y < gridHeight - 1) {
                grid[x][y].neighbours.push(grid[x][y + 1]);
            }
            // if not at the top, add the node above
            if (x > 0) {
                grid[x][y].neighbours.push(grid[x - 1][y]);
            }
            // if not at the bottom, add the node below
            if (x < gridWidth - 1) {
                grid[x][y].neighbours.push(grid[x + 1][y]);
            }
        }
    }
    myGrid.grid = grid;
}

let dpi = window.devicePixelRatio;
const canvas = document.getElementById("display");
const context = canvas.getContext("2d");

function fixDpi() {
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
}

document.getElementById("setParams").onsubmit = function (e) {
    e.preventDefault();
    myGrid.setArea();
    setUpGrid();
    setRandomStartEnd();
    draw();
};

window.onload = function () {
    myGrid.setArea();
    setUpGrid();
    setRandomStartEnd();
    draw();
}

function draw() {
    fixDpi();

    const area = myGrid.area;
    let gridSize = canvas.width / area;
    myGrid.gridSize = gridSize;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 3;

    for (let x = 0; x < area; x++) {
        for (let y = 0; y < area; y++) {
            // get color
            let color = 'cornflowerblue';
            if (myGrid.grid[x][y].isObstacle) color = 'lightslategrey';
            if (myGrid.grid[x][y].visited) color = 'gold';
            if (myGrid.start === myGrid.grid[x][y]) color = 'green';
            if (myGrid.end === myGrid.grid[x][y]) color = 'maroon';
            context.fillStyle = color;
            context.fillRect(x * gridSize + padding, y * gridSize + padding, gridSize - padding * 2, gridSize - padding * 2);
        }
    }

    //draw path
    if (myGrid.end.parent) {
        let p = myGrid.end;
        while (p !== null) {
            if (p === myGrid.end || p === myGrid.start) {
                p = p.parent;
                continue
            }
            context.fillStyle = 'darkorchid';
            context.fillRect(p.x * gridSize + padding, p.y * gridSize + padding, gridSize - padding * 2, gridSize - padding * 2);
            p = p.parent;
        }
    }
}

function setRandomStartEnd() {
    const area = myGrid.area;
    let c = getRandomXY(area);
    myGrid.start = myGrid.grid[c.x][c.y];
    let t;
    do {
        t = getRandomXY(area);
    } while (t.x === c.x && t.y === c.y)
    myGrid.end = myGrid.grid[t.x][t.y];
}

function getRandomXY(area) {

    return {
        x: Math.floor(Math.random() * (area)),
        y: Math.floor(Math.random() * (area))
    } // inclusive
}

function solve() {
    const area = myGrid.area;
    for (let x = 0; x < area; x++) {
        for (let y = 0; y < area; y++) {
            myGrid.grid[x][y].visited = false;
            myGrid.grid[x][y].GlobalGoal = Infinity;
            myGrid.grid[x][y].LocalGoal = Infinity;
            myGrid.grid[x][y].parent = null;
        }
    }

    function distance(node1, node2) {
        return Math.sqrt((node1.x - node2.x) * (node1.x - node2.x) + (node1.y - node2.y) * (node1.y - node2.y));
    }

    function heuristic(node1, node2) {
        return distance(node1, node2);
    }

    let currentNode = myGrid.start;
    myGrid.start.LocalGoal = 0.0;
    myGrid.start.GlobalGoal = heuristic(myGrid.start, myGrid.end);

    let notTestedNodes = [];
    notTestedNodes.push(myGrid.start);

    while (notTestedNodes.length !== 0 && currentNode !== myGrid.end) {
        // sort untested nodes by global goal, lowest first
        notTestedNodes.sort(function (a, b) {
            return a.GlobalGoal - b.GlobalGoal;
        });

        // check if the nodes have een visited
        // remove if visited
        while (notTestedNodes.length !== 0 && notTestedNodes[0].visited) {
            notTestedNodes.shift();
        }

        if (notTestedNodes.length === 0) {
            break;
        }

        currentNode = notTestedNodes[0];
        currentNode.visited = true;

        // check each of the nodes neighbour
        for (let neighbour of currentNode.neighbours) {
            // if not visited and not and obstacke
            // add it to the nottestednode
            if (!neighbour.visited && !neighbour.isObstacle) {
                notTestedNodes.push(neighbour);
            }

            // calculate potential lowest parent distance
            let possibleLowerGoal = currentNode.LocalGoal + distance(currentNode, neighbour);

            if (possibleLowerGoal < neighbour.LocalGoal) {
                neighbour.parent = currentNode;
                neighbour.LocalGoal = possibleLowerGoal;

                neighbour.GlobalGoal = neighbour.LocalGoal + heuristic(neighbour, myGrid.end);
            }
        }
    }
    return true;
}

document.getElementById("solve-btn").onclick = function () {
    solve();
    draw();
}

canvas.addEventListener("click", addObstacleAndSolve)

function addObstacleAndSolve(e) {
    let rect = canvas.getBoundingClientRect();
    // divide by gridsize to get the top left as ref
    let x = Math.floor((e.clientX - rect.x) / (myGrid.gridSize / dpi));
    let y = Math.floor((e.clientY - rect.y) / (myGrid.gridSize / dpi));

    // check if the location is start or end
    // if not change it to obstacle
    if (myGrid.grid[x][y] === myGrid.start || myGrid.grid[x][y] === myGrid.end) {
        return
    }

    myGrid.grid[x][y].isObstacle = true;
    draw();
}
