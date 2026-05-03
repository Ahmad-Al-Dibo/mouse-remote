/* ----------------------------
    Variables
----------------------------- */
let automationEnabled = false;
const automationPattern = []
/* ----------------------------
   Coordinates
----------------------------- */
async function fetchCoordinates() {
    const res = await fetch("/coordinates");
    const data = await res.json();
    document.getElementById("x").textContent = data.x;
    document.getElementById("y").textContent = data.y;
}

fetchCoordinates();
setInterval(fetchCoordinates, 1000);

/* ----------------------------
   Step Movement (D-Pad)
----------------------------- */
function getStep() {
    const s = Number(document.getElementById("stepSize").value);
    return isNaN(s) || s <= 0 ? 10 : s;
}

async function moveDir(dx, dy) {
    const step = getStep();

    const res = await fetch("/coordinates");
    const pos = await res.json();

    if (pos.x + dx * step < 5 || pos.y + dy * step < 5) return;

    await fetch("/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            add_x: dx * step,
            add_y: dy * step
        })
    });

    fetchCoordinates();
}

/* ----------------------------
   Click
----------------------------- */
async function clickHere() {
    const res = await fetch("/coordinates");
    const pos = await res.json();

    if (automationEnabled){
        automationPattern.push([pos.x, pos.y]);
    }

    await fetch("/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            x: pos.x,
            y: pos.y
        })
    });
}


async function clickPattern(){
    if (automationPattern.length === 0) return;

    await fetch("/click_pattern", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            positions: automationPattern,
            repeat: document.getElementById("repeat").value,
            delay: document.getElementById("delay").value,
            sleep_time: document.getElementById("sleep_time").value,
            automationEnabled: automationEnabled

        })
    })};


/* ----------------------------
   Reset
----------------------------- */
async function resetMouse() {
    await fetch("/reset", { method: "POST" });
    fetchCoordinates();
}


/* ----------------------------
   Touchpad Smooth Control
----------------------------- */
const touchpad = document.getElementById("touchpad");
let lastX = null;
let lastY = null;
let dragging = false;
const SENSITIVITY = 1.4;

touchpad.addEventListener("mousedown", e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

document.addEventListener("mouseup", () => {
    dragging = false;
    lastX = lastY = null;
});

touchpad.addEventListener("mousemove", async e => {
    if (!dragging) return;

    const dx = Math.round((e.clientX - lastX) * SENSITIVITY);
    const dy = Math.round((e.clientY - lastY) * SENSITIVITY);

    lastX = e.clientX;
    lastY = e.clientY;

    if (dx === 0 && dy === 0) return;

    await fetch("/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ add_x: dx, add_y: dy })
    });
});

/* Touch support */
touchpad.addEventListener("touchstart", e => {
    const t = e.touches[0];
    lastX = t.clientX;
    lastY = t.clientY;
});

touchpad.addEventListener("touchmove", async e => {
    e.preventDefault();
    const t = e.touches[0];

    const dx = Math.round((t.clientX - lastX) * SENSITIVITY);
    const dy = Math.round((t.clientY - lastY) * SENSITIVITY);

    lastX = t.clientX;
    lastY = t.clientY;

    if (dx === 0 && dy === 0) return;

    await fetch("/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ add_x: dx, add_y: dy })
    });
});

touchpad.addEventListener('click', async e =>{
   clickHere();  
})


const changeStatus = () => {
      document.getElementById('automationStatus').textContent = automationEnabled ? "ON" : "OFF";
}

function switchAutomatation(){
    automationEnabled = !automationEnabled;
    changeStatus();
}

function clearAutomatation(){
    automationPattern.length = 0;
    changeStatus();
}

function getPattern(){
    return automationPattern.map(pos => `(${pos[0]}, ${pos[1]})`).join(", ");
}

function showPattern(){
    const patternStr = getPattern();
    document.getElementById("pattern").textContent = patternStr || "No positions added.";
}