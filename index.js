console.log("Starting");

function setUpGrid(gridWidth, gridHeight) {
    // canvas is made up of a 2d array with each position being a node.
    class Node {
        constructor(x, y) {
            this.isObstacle = false;
            this.visited = false;
            this.GlobalGoal = null;
            this.LocalGoal = null;
            this.x = x;
            this.y = y;
            this.neighbours = [];
            this.parent = null;
        }
    }
    // create a grid to hold the nodes
    // grid shape in an array
    // [
    //     [x, x, x],
    //     [x, x, x],
    //     [x, x, x]
    // ]

    let grid = new Array(gridWidth).fill(new Array(gridHeight));

    // populate with nodes
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            let newNode = new Node(x, y);
            grid[x][y] = newNode;
        }
    }

    // create connections to every neighbouring nodes
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
    return grid;
}

let dpi = window.devicePixelRatio;
const canvas = document.getElementById("display");
const context = canvas.getContext("2d");

context.fillStyle = 'lightgrey';
context.fillRect(0, 0, canvas.width, canvas.height);

function fixDpi() {
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
    return style_height * dpi;
}

document.getElementById("setParams").onsubmit = function (e) {
    e.preventDefault();
    // get new area
    // get set new sizing
    // redraw
    let side = fixDpi();

    let area = parseInt(e.target[0].value); // no of grid area
    let gridSize = side / area;
    let padding = 1;

    let newGrid = setUpGrid(area, area);

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < area; x++) {
        for (let y = 0; y < area; y++) {
            // get color
            context.fillStyle = newGrid[x][y].isObstacle ? 'grey' : 'blue';
            context.fillRect(x * gridSize + padding, y * gridSize + padding, gridSize - padding * 2, gridSize - padding * 2);
        }
    }
};



