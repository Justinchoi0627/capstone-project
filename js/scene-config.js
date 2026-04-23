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

/**
 * iOS Safari + AR.js: keep the WebGL buffer transparent and the webcam element
 * compositing correctly (clear color + scene background; videos must not stay
 * display:none or WebKit may not feed frames to WebGL).
 */
(function wireArIosPassthrough() {
  const sceneEl = document.querySelector("a-scene");
  if (!sceneEl) {
    return;
  }

  function forceTransparentClear() {
    const r = sceneEl.renderer;
    if (!r || typeof r.setClearColor !== "function") {
      return;
    }
    r.setClearColor(0x000000, 0);
    if (r.domElement) {
      r.domElement.style.backgroundColor = "transparent";
    }
    if (sceneEl.object3D) {
      sceneEl.object3D.background = null;
    }
  }

  function patchVideosForWebKit() {
    document.querySelectorAll("video").forEach((v) => {
      if (window.getComputedStyle(v).display === "none") {
        v.style.display = "block";
        v.style.position = "fixed";
        v.style.width = "2px";
        v.style.height = "2px";
        v.style.opacity = "0.02";
        v.style.right = "0";
        v.style.bottom = "0";
        v.style.pointerEvents = "none";
        v.style.zIndex = "0";
        v.style.objectFit = "cover";
      }
    });
    const main = document.querySelector("#arjs-video");
    if (main) {
      main.style.display = "block";
      main.style.visibility = "visible";
      main.playsInline = true;
      main.muted = true;
      main.play().catch(() => {});
    }
  }

  function runClearLoop() {
    let n = 0;
    function frame() {
      forceTransparentClear();
      patchVideosForWebKit();
      if (++n < 300) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  sceneEl.addEventListener("loaded", () => {
    sceneEl.setAttribute("background", "transparent: true");
    forceTransparentClear();
    patchVideosForWebKit();
    runClearLoop();
  });

  window.addEventListener("arjs-video-loaded", () => {
    patchVideosForWebKit();
    forceTransparentClear();
  });

  let moTimer = 0;
  const mo = new MutationObserver(() => {
    window.clearTimeout(moTimer);
    moTimer = window.setTimeout(patchVideosForWebKit, 40);
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
