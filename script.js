const shades = [
  { name: "Sky", value: "#7DD3FC" },
  { name: "Ocean", value: "#38BDF8" },
  { name: "Azure", value: "#3B82F6" },
  { name: "Cobalt", value: "#2563EB" },
  { name: "Midnight", value: "#1D4ED8" }
];

const signShapes = [
  { name: "Rectangle", value: "rectangle" },
  { name: "Rounded", value: "rounded" },
  { name: "Circle", value: "circle" },
  { name: "Arrow", value: "arrow" }
];

const swatchesEl = document.getElementById("swatches");
const shapeOptionsEl = document.getElementById("shapeOptions");
const signInput = document.getElementById("signText");
const addSignButton = document.getElementById("addSignButton");
const charCount = document.getElementById("charCount");
const signPreview = document.getElementById("signPreview");
const cityFrame = document.getElementById("cityFrame");

const panelToggle = document.getElementById("panelToggle");
const sidePanel = document.getElementById("sidePanel");
const panelOverlay = document.getElementById("panelOverlay");

let selectedBlue = shades[2].value;
let selectedShape = "rectangle";
let pendingSign = null;

function sanitizeText(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9 !?.-]/g, "")
    .slice(0, 10);
}

function styleBoard(board, shape, color) {
  board.style.background = color;
  board.style.color = "#ffffff";
  board.style.fontWeight = "700";
  board.style.fontSize = "12px";
  board.style.letterSpacing = "0.08em";
  board.style.textAlign = "center";
  board.style.display = "flex";
  board.style.alignItems = "center";
  board.style.justifyContent = "center";
  board.style.boxSizing = "border-box";
  board.style.padding = "8px 10px";
  board.style.border = "3px solid rgba(255,255,255,0.9)";
  board.style.boxShadow = "0 4px 12px rgba(0,0,0,0.18)";
  board.style.userSelect = "none";

  if (shape === "rectangle") {
    board.style.width = "92px";
    board.style.height = "44px";
    board.style.borderRadius = "6px";
    board.style.clipPath = "none";
  }

  if (shape === "rounded") {
    board.style.width = "92px";
    board.style.height = "44px";
    board.style.borderRadius = "999px";
    board.style.clipPath = "none";
  }

  if (shape === "circle") {
    board.style.width = "70px";
    board.style.height = "70px";
    board.style.borderRadius = "999px";
    board.style.clipPath = "none";
    board.style.fontSize = "11px";
    board.style.lineHeight = "1.1";
    board.style.padding = "8px";
  }

  if (shape === "arrow") {
    board.style.width = "100px";
    board.style.height = "46px";
    board.style.borderRadius = "0";
    board.style.clipPath = "polygon(0 0, 78% 0, 78% 18%, 100% 50%, 78% 82%, 78% 100%, 0 100%)";
  }
}

function updateSignPreview() {
  const cleaned = sanitizeText(signInput.value);
  signInput.value = cleaned;
  signPreview.textContent = cleaned || "HELLO";
  charCount.textContent = cleaned.length;

  styleBoard(signPreview, selectedShape, selectedBlue);
  signPreview.style.position = "relative";
  signPreview.style.marginTop = "6px";
}

function renderSwatches() {
  swatchesEl.innerHTML = "";

  shades.forEach((shade) => {
    const button = document.createElement("button");
    button.className = `swatch${shade.value === selectedBlue ? " active" : ""}`;
    button.type = "button";

    button.innerHTML = `
      <span class="swatch-dot" style="background:${shade.value}"></span>
      <span>${shade.name}</span>
    `;

    button.addEventListener("click", () => {
      selectedBlue = shade.value;
      updateSignPreview();
      renderSwatches();
    });

    swatchesEl.appendChild(button);
  });
}

function renderShapeOptions() {
  shapeOptionsEl.innerHTML = "";

  signShapes.forEach((shape) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = shape.name;
    button.className = `shape-option${shape.value === selectedShape ? " active" : ""}`;

    button.style.marginRight = "8px";
    button.style.marginBottom = "8px";
    button.style.padding = "8px 12px";
    button.style.borderRadius = "999px";
    button.style.border = "1px solid #cbd5e1";
    button.style.background = shape.value === selectedShape ? "#dbeafe" : "#ffffff";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      selectedShape = shape.value;
      updateSignPreview();
      renderShapeOptions();
    });

    shapeOptionsEl.appendChild(button);
  });
}

function setPanelState(isOpen) {
  sidePanel.classList.toggle("open", isOpen);
  panelOverlay.classList.toggle("active", isOpen);
  panelToggle.setAttribute("aria-expanded", String(isOpen));
  sidePanel.setAttribute("aria-hidden", String(!isOpen));
}

function togglePanel() {
  const isOpen = !sidePanel.classList.contains("open");
  setPanelState(isOpen);
}

function beginPlacementMode() {
  const cleaned = sanitizeText(signInput.value);

  pendingSign = {
    text: cleaned || "HI",
    color: selectedBlue,
    shape: selectedShape
  };

  cityFrame.style.cursor = "crosshair";
  setPanelState(false);
}

function createSignElement(text, color, shape, x, y) {
  const wrapper = document.createElement("div");
  wrapper.className = "city-sign-instance";
  wrapper.style.position = "absolute";
  wrapper.style.left = `${x}px`;
  wrapper.style.top = `${y}px`;
  wrapper.style.transform = "translate(-50%, -100%)";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.pointerEvents = "none";
  wrapper.style.zIndex = String(20 + Math.floor(y / 10));

  const board = document.createElement("div");
  board.textContent = text;
  styleBoard(board, shape, color);

  const pole = document.createElement("div");
  pole.style.width = "8px";
  pole.style.height = "54px";
  pole.style.background = "#7c5a3d";
  pole.style.borderRadius = "8px";
  pole.style.marginTop = "-2px";
  pole.style.boxShadow = "0 2px 4px rgba(0,0,0,0.12)";

  wrapper.appendChild(board);
  wrapper.appendChild(pole);

  return wrapper;
}

function placePendingSign(event) {
  if (!pendingSign) return;

  const rect = cityFrame.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const sign = createSignElement(
    pendingSign.text,
    pendingSign.color,
    pendingSign.shape,
    x,
    y
  );

  cityFrame.appendChild(sign);

  pendingSign = null;
  cityFrame.style.cursor = "default";
}

signInput.addEventListener("input", updateSignPreview);

addSignButton.addEventListener("click", () => {
  updateSignPreview();
  beginPlacementMode();
});

cityFrame.addEventListener("click", placePendingSign);

panelToggle.addEventListener("click", togglePanel);
panelOverlay.addEventListener("click", () => setPanelState(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setPanelState(false);
    pendingSign = null;
    cityFrame.style.cursor = "default";
  }
});

updateSignPreview();
renderSwatches();
renderShapeOptions();
setPanelState(false);