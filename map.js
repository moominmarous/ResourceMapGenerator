const COLORS = Object.freeze(['#7B93AB', '#73B7FF', '#A09A44', '#496643']);

const DIMENSIONS = {};

const getDimensions = (flag) => {
    if (flag != 0) {
        document.getElementById("cell-input").value = Math.floor(Math.random() * 9) + 1;
        document.getElementById("width-input").value = Math.floor(Math.random() * 9) + 1;
        document.getElementById("height-input").value = Math.floor(Math.random() * 9) + 1;
    }
    DIMENSIONS.cell_size = document.getElementById("cell-input").value;
    DIMENSIONS.map_w = document.getElementById("width-input").value * DIMENSIONS.cell_size;
    DIMENSIONS.map_h = document.getElementById("height-input").value * DIMENSIONS.cell_size;
    transformContainer();
    console.log(DIMENSIONS);
}

const transformContainer = () => {
    let container = document.getElementById('map-space');
    if (container.childElementCount == 0) return;
    let selectedMap = document.getElementById("map-select").value;
    if (selectedMap == 2) {
        container.style.height = "50 %";
        container.style.transform = "rotateX(60deg) rotateZ(45deg)";
        container.style.transformOrigin = "center";
        container.style.boxShadow = "20px 20px 50px 10px grey"
    } else {
        container.style.transform = "";

    }
    console.log('transform!')
}

const drawMap = (map, container) => {
    for (let i = 0; i < map.length; i++) {
        let element = map[i];
        let unit = document.createElement('div')
        unit.className = 'cell-unit';
        unit.width = container.width / DIMENSIONS.map_w;
        unit.height = unit.width
        unit.style.backgroundColor = COLORS[element];
        if (i % DIMENSIONS.cell_size == 0) {
            unit.style.borderLeft = '1px solid #ccc';
        }
        if (Math.ceil(((i + 1) / DIMENSIONS.map_w)) % DIMENSIONS.cell_size == 0) {
            unit.style.borderBottom = '1px solid #ccc';
        }
        container.appendChild(unit);
    }
}

const generateMap = (flag) => {
    getDimensions(flag);
    //make map
    let map = new Array(DIMENSIONS.map_w * DIMENSIONS.map_h);
    for (let i = 0; i < map.length; i++) {
        map[i] = Math.floor(Math.random() * 4); // Assign random values to each element
    }
    let container = document.getElementById('map-space');
    container.innerHTML = ''; //clear
    console.log(container);
    container.style.gridTemplateColumns = `repeat(${DIMENSIONS.map_w}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${DIMENSIONS.map_h}, 1fr)`;
    container.style.width = `${20 * DIMENSIONS.map_w}px`;
    container.style.height = `${20 * DIMENSIONS.map_h}px`;
    drawMap(map, container);
};