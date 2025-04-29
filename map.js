const COLORS = Object.freeze(['#7B93AB', '#73B7FF', '#A09A44', '#496643']);
let VISIBLE = false;
const DIMENSIONS = {};

const STATS = new Array(4);

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
}

const transformContainer = () => {
    let container = document.getElementById('map-space');
    if (container.childElementCount == 0) return;
    let selectedMap = document.getElementById("map-select").value;
    if (selectedMap == 2) {
        container.style.height = "50 %";
        container.style.transform = "rotateX(60deg) rotateZ(45deg)";
        container.style.transformOrigin = "center";
        // container.style.boxShadow = "20px 20px 50px 10px grey"
    } else {
        container.style.transform = "";
    }
}

const drawMap = (map, container) => {
    for (let i = 0; i < map.length; i++) {
        let element = map[i];
        let unit = document.createElement('div')
        unit.className = 'cell-unit';
        unit.width = container.width / DIMENSIONS.map_w;
        unit.height = unit.width
        unit.style.backgroundColor = COLORS[element];
        unit.innerText = element;
        if (i % DIMENSIONS.cell_size == 0) {
            unit.style.borderLeft = '1px solid #ccc';
        }
        if (Math.ceil(((i + 1) / DIMENSIONS.map_w)) % DIMENSIONS.cell_size == 0) {
            unit.style.borderBottom = '1px solid #ccc';
        }
        container.appendChild(unit);
    }
}
const textVisible = () => {
    let choice = document.getElementById("text-select").value;
    VISIBLE = (choice == 'true') ? true : false;
    document.getElementById('map-space').style.color = (VISIBLE) ? 'black' : '#00000000'

}

const generateMap = (flag) => {
    clearStats();
    getDimensions(flag);
    textVisible();
    //make map
    let map = new Array(DIMENSIONS.map_w * DIMENSIONS.map_h);
    for (let i = 0; i < map.length; i++) {
        let val = Math.floor(Math.random() * 4); // Assign random values to each element
        map[i] = val;
        if (STATS[val] == undefined) {
            STATS[val] = 1;
        } else {
            STATS[val] += 1;
        }
        // console.log(`${val} => ${STATS[val]}`)
    }
    printStats();
    let container = document.getElementById('map-space');
    container.innerHTML = ''; //clear
    container.style.gridTemplateColumns = `repeat(${DIMENSIONS.map_w}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${DIMENSIONS.map_h}, 1fr)`;
    container.style.width = `${20 * DIMENSIONS.map_w}px`;
    container.style.height = `${20 * DIMENSIONS.map_h}px`;
    DIMENSIONS.scale = 1;
    drawMap(map, container);

};

const zoom = (scale) => {
    //-1 is out | 0 default | 1 is in
    if (scale == 0) {
        DIMENSIONS.scale = 1.0;
    } else if (scale == 1) {
        DIMENSIONS.scale = Math.min(2.0, DIMENSIONS.scale + 0.05);
    } else {
        DIMENSIONS.scale = Math.max(0.1, DIMENSIONS.scale - 0.10);
    }
    document.getElementById("map-space").style.transformOrigin = "top center";
    let scaleIndex = document.getElementById("map-space").style.transform.indexOf("scale(");
    if (scaleIndex == -1) {
        document.getElementById("map-space").style.transform += ` scale(${DIMENSIONS.scale})`
    } else {
        let transformString = document.getElementById("map-space").style.transform.substring(0, scaleIndex) + ` scale(${DIMENSIONS.scale})`
        document.getElementById("map-space").style.transform = transformString;
    }
}

const clearStats = () => {
    for (let i = 0; i < STATS.length; i++) {
        STATS[i] = 0;
    }
    document.getElementById("statsData").innerHTML = "";
    document.getElementById("totalResources").value = "";
}

const printStats = () => {
    let totalRes = document.getElementById("totalResources").value = DIMENSIONS.map_w * DIMENSIONS.map_h;

    let stats = document.getElementById("statsData");
    /**
     * <div>Resource 1: <input class="statText" disabled value="0"></input></div>
     */
    for (let i = 0; i < STATS.length; i++) {
        let wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '10px';
        wrapper.style.alignContent = 'center'
        wrapper.style.justifyContent = 'center'
        wrapper.innerText = `Resource ${i}:`
        let v = document.createElement('input');
        v.className = "statText";
        v.disabled = true;
        v.value = STATS[i];
        wrapper.appendChild(v);
        let c = document.createElement('div')
        c.className = 'color-block';
        c.innerText = '▉'
        c.style.color = COLORS[i];
        c.style.backgroundColor = COLORS[i];
        c.style.userSelect = 'none'
        wrapper.append(c);

        stats.append(wrapper);
    }
}

window.onload = () => {
    document.getElementById("map-select").value = "1"; // Set default to "Orthogonal"
    document.getElementById("totalResources").value = "0";
    document.getElementById("text-select").value = "false";
    VISIBLE = false;
    transformContainer(); // Apply the default transformation
};