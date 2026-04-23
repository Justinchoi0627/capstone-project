const markerMap = [
  { frameId: "frame-1", markerType: "kanji", markerValue: "preset:kanji" },
  { frameId: "frame-2", markerType: "barcode", markerValue: "0" },
  { frameId: "frame-3", markerType: "barcode", markerValue: "1" },
  { frameId: "frame-4", markerType: "barcode", markerValue: "2" },
];

const versionBadgeValue = document.querySelector(".version-badge__value");
if (versionBadgeValue) {
  const versionUrl = new URL("version.txt", window.location.href);
  fetch(versionUrl.href, { cache: "no-store" })
    .then((res) => (res.ok ? res.text() : Promise.reject()))
    .then((text) => {
      versionBadgeValue.textContent = text.trim() || "—";
    })
    .catch(() => {
      versionBadgeValue.textContent = "dev";
    });
}

const dismissButton = document.getElementById("dismiss-instructions");
const instructions = document.getElementById("instructions");

if (dismissButton && instructions) {
  dismissButton.addEventListener("click", () => {
    instructions.style.display = "none";
  });
}

for (const marker of markerMap) {
  const markerEntity = document.getElementById(`marker-${marker.frameId}`);
  if (!markerEntity) {
    continue;
  }

  markerEntity.addEventListener("markerFound", () => {
    console.info(`Detected ${marker.frameId} (${marker.markerType}:${marker.markerValue})`);
  });

  markerEntity.addEventListener("markerLost", () => {
    console.info(`Lost ${marker.frameId}`);
  });
}
