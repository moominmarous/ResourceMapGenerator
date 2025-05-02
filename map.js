const COLORS = Object.freeze(['#7B93AB', '#73B7FF', '#A09A44', '#496643']);
let VISIBLE = false;
const DIMENSIONS = {};
const zoomrange = Array.from({ length: 20 }, (_, i) => parseFloat((0.1 * (i + 1)).toFixed(1)));
let zoomIndex = 9
const UNITWIDTH = 20
const STATS = new Array(4);

let isDragging = false;
// let offsetX, offsetY;

const coordPoint = (x = 0, y = 0) => {
    return { x: x, y: y }
}

let start = coordPoint();
let offset = coordPoint();

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
    console.log(`selected map: ${selectedMap}`)
    if (selectedMap == 2) {
        // ISOMETRIC SELECTION
        // container.style.transform = "rotateX(60deg) rotateZ(45deg)";
        container.style.transform = "rotateX(60deg) rotateZ(45deg)";
        container.style.transformOrigin = "center";
        console.log('ISOMETRIC CHOICE')
        // container.style.boxShadow = "20px 20px 50px 10px grey"
    } else {
        container.style.transform = "";
        console.log('ORTHOGONAL CHOICE')
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
        // unit.style.border = `1px solid ${COLORS[element]}`
        if (i % DIMENSIONS.cell_size == 0) {
            unit.style.borderLeft = '1px solid #ccc';
        } if (Math.ceil(((i + 1) / DIMENSIONS.map_w)) % DIMENSIONS.cell_size == 0) {
            unit.style.borderBottom = '1px solid #ccc';
        }
        // unit.addEventListener("mouseenter", (e) => {
        //     console.log(`${unit.style.backgroundColor}`)
        // })
        container.appendChild(unit);
    }
}
const textVisible = () => {
    let choice = document.getElementById("text-select").value;
    VISIBLE = (choice == 'true') ? true : false;
    document.getElementById('map-space').style.color = (VISIBLE) ? 'black' : '#00000000'

}


/**
 * This is the main function
 * @param {*} flag determines whether dimensions are as selected or randomized.
 */
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
    container.style.width = `${UNITWIDTH * DIMENSIONS.map_w}px`;
    container.style.height = `${UNITWIDTH * DIMENSIONS.map_h}px`;
    DIMENSIONS.scale = 1;
    drawMap(map, container);
    moveMap(container);
};

const isometricTransform = (x, y) => {
    // rotateX(60deg) rotateZ(45deg)
    // Define the isometric transformation matrix
    let angleX = 60 * (Math.PI / 180); // Convert degrees to radians
    let angleZ = 45 * (Math.PI / 180);

    // Apply the isometric transformation
    let transformedX = x * Math.cos(angleZ) - y * Math.sin(angleZ);
    let transformedY = x * Math.sin(angleZ) * Math.cos(angleX) + y * Math.cos(angleZ) * Math.cos(angleX);

    return { x: transformedX, y: transformedY };
};

let containerPos = coordPoint(0, 0);


const moveMap = (container) => {
    let point = document.getElementById('point');

    container.addEventListener("mousedown", (e) => {
        isDragging = true;

        // Update the red dot position (fixed at the mouse press location)
        point.style.left = `${e.clientX - 2.5}px`;
        point.style.top = `${e.clientY - 2.5}px`;

        // Store the starting point and offset
        start = coordPoint(e.clientX, e.clientY);
        offset.x = e.clientX - container.getBoundingClientRect().left;
        offset.y = e.clientY - container.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        // Update the red dot position
        point.style.left = `${e.clientX - 2.5}px`;
        point.style.top = `${e.clientY - 2.5}px`;

        // Move the container based on mouse movement
        container.style.position = 'absolute';
        container.style.left = `${e.clientX - offset.x}px`;
        container.style.top = `${e.clientY - offset.y}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
};

// const moveMap = (container) => {
//     let point = document.getElementById('point');
//     console.log(`container dims: ${container.getBoundingClientRect()}`);
//     container.addEventListener("mousedown", (e) => {
//         isDragging = true;
//         //update red dot position
//         point.style.left = `${e.clientX - 2.5}px`;
//         point.style.top = `${e.clientY - 2.5}px`;
//         console.log(`container pos old? ${containerPos.x},${containerPos.y}`)
//         containerPos.y = container.style.top;
//         containerPos.x = container.style.left;
//         console.log(`container pos new? ${containerPos.x},${containerPos.y}`)

//         start = coordPoint(e.clientX, e.clientY);
//         offset.x = e.clientX - container.getBoundingClientRect().left;
//         offset.y = e.clientY - container.getBoundingClientRect().top;
//         //console.log(`offsets? ${offset.x},${offset.y}`)

//         //console.log(`Start point: (${start.x}, ${start.y})`);
//         //console.log(`at zoom ${DIMENSIONS.scale} container dims: ${container.getBoundingClientRect().left}, ${container.getBoundingClientRect().top}`);
//     })
//     document.addEventListener("mousemove", (e) => {
//         if (!isDragging) return;

//         // Update red point
//         point.style.left = `${e.clientX - 2.5}px`;
//         point.style.top = `${e.clientY - 2.5}px`;

//         // Calculate the movement in the orthogonal plane
//         let deltaX = e.clientX - start.x;
//         let deltaY = e.clientY - start.y;

//         container.style.position = 'absolute';

//         if (container.style.transform.indexOf('rotate') !== -1) {

//             // let isoCoord = isometricTransform(deltaX, deltaY)
//             // let eventIso = isometricTransform(e.clientX, e.clientY)

//             // Update the container's position
//             container.style.left = `${containerPos.x + offset.x}px`;
//             container.style.top = `${containerPos.y + offset.y}px`;
//             console.log(`location:(${container.style.left},${container.style.top} : deltas:${deltaX},${deltaY})`)

//         } else {
//             // Orthogonal movement (no transformation applied)
//             container.style.left = `${e.clientX - offset.x}px`;
//             container.style.top = `${e.clientY - offset.y}px`;
//         }
//     })
//     document.addEventListener("mouseup", (e) => {
//         isDragging = false;
//         // if (start != undefined) {
//         //     let distanceX = e.clientX - start.x;
//         //     let distanceY = e.clientY - start.y;
//         //     document.getElementById('distanceX').value = distanceX;
//         //     document.getElementById('distanceY').value = distanceY;
//         // }
//     });
// }


const zoom = (scale) => {
    let container = document.getElementById("map-space");
    //-1 is out | 0 default | 1 is in
    if (scale == 0) {
        DIMENSIONS.scale = 1.0;
        container.style.position = 'absolute';
        container.style.top = '50px'
        container.style.left = '50px';
        console.log(`map space width: ${container.style.width}`);
        let half = parseFloat(container.style.width) / (2 * DIMENSIONS.scale);
        console.log(`map space 1/2: ${half} px`);
        container.style.left = `${half}px`

    } else if (scale == 1) {
        DIMENSIONS.scale = Math.min(2.0, DIMENSIONS.scale + 0.05);
        // DIMENSIONS.scale = DIMENSIONS.scale.toFixed(3)
    } else {
        DIMENSIONS.scale = Math.max(0.1, DIMENSIONS.scale - 0.10).toFixed(2);
    }
    container.style.transformOrigin = "center";
    //this updates transform string without writing scale over and over:
    let scaleIndex = container.style.transform.indexOf("scale(");
    if (scaleIndex == -1) {
        container.style.transform += ` scale(${DIMENSIONS.scale})`
    } else {
        let transformString = container.style.transform.substring(0, scaleIndex) + ` scale(${DIMENSIONS.scale})`
        container.style.transform = transformString;
    }
    //update zoom info:
    let zoomLabel = document.getElementById('zoomScale');
    zoomLabel.value = DIMENSIONS.scale;
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