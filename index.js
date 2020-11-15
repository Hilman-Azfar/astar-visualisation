console.log("Starting");

let myGrid = {
    area: function () { return parseInt(document.getElementById("area").value) },
    grid: null,
    start: null,
    end: null,
}

class Node {
    constructor(x, y) {
        this.name = null;
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

    const gridHeight = myGrid.area();
    const gridWidth = myGrid.area();
    let grid = Array.from(Array(gridWidth), () => new Array(gridHeight));

    // populate with nodes
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            let newNode = new Node(x, y);
            newNode.name = `${x} and ${y}`;
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
    setUpGrid();
    setRandomStartEnd();
    draw();
};

window.onload = function () {
    setUpGrid();
    setRandomStartEnd();
    draw();
}

function draw() {
    fixDpi();

    const area = myGrid.area();
    let gridSize = canvas.width / area;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 3;
    for (let x = 0; x < area; x++) {
        for (let y = 0; y < area; y++) {
            // get color
            let color = 'blue';
            if (myGrid.grid[x][y].isObstacle) color = 'grey';
            if (myGrid.start === myGrid.grid[x][y]) color = 'green';
            if (myGrid.end === myGrid.grid[x][y]) color = 'red';
            context.fillStyle = color;
            context.fillRect(x * gridSize + padding, y * gridSize + padding, gridSize - padding * 2, gridSize - padding * 2);
        }
    }
}

function setRandomStartEnd() {
    const area = myGrid.area();
    let c = getRandomXY(area);
    myGrid.start = myGrid.grid[c.x][c.y];
    let t;
    do {
        t = getRandomXY(area);
    } while (t === c)
    myGrid.end = myGrid.grid[t.x][t.y];
}

function getRandomXY(area) {

    return {
        x: Math.floor(Math.random() * (area)),
        y: Math.floor(Math.random() * (area))
    }// inclusive
}



