const shades = [
  { name: "Sky", value: "#7DD3FC" },
  { name: "Ocean", value: "#38BDF8" },
  { name: "Azure", value: "#3B82F6" },
  { name: "Cobalt", value: "#2563EB" },
  { name: "Midnight", value: "#1D4ED8" }
];

const swatchesEl = document.getElementById("swatches");
const signInput = document.getElementById("signText");
const signEl = document.getElementById("citySign");
const addSignButton = document.getElementById("addSignButton");
const charCount = document.getElementById("charCount");

const panelToggle = document.getElementById("panelToggle");
const sidePanel = document.getElementById("sidePanel");
const panelOverlay = document.getElementById("panelOverlay");

let selectedBlue = shades[2].value;

function sanitizeText(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9 !?.-]/g, "")
    .slice(0, 10);
}

function updateSignPreview() {
  const cleaned = sanitizeText(signInput.value);
  signInput.value = cleaned;
  signEl.textContent = cleaned || "HI";
  signEl.style.background = selectedBlue;
  charCount.textContent = cleaned.length;
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
      signEl.style.background = selectedBlue;
      renderSwatches();
    });

    swatchesEl.appendChild(button);
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

signInput.addEventListener("input", updateSignPreview);

addSignButton.addEventListener("click", () => {
  updateSignPreview();
  signEl.style.display = "block";
  setPanelState(false);
});

panelToggle.addEventListener("click", togglePanel);
panelOverlay.addEventListener("click", () => setPanelState(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setPanelState(false);
  }
});

updateSignPreview();
renderSwatches();
setPanelState(false);