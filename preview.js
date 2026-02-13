const devicePreviews = document.querySelectorAll(".device-preview");
const captureBtn = document.getElementById("captureBtn");

const parsePx = (value) => {
  const parsed = parseFloat(value.replace("px", ""));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getViewportSize = (element) => {
  const styles = getComputedStyle(element);
  return {
    width: parsePx(styles.getPropertyValue("--viewport-width")),
    height: parsePx(styles.getPropertyValue("--viewport-height")),
  };
};

const updateScale = () => {
  const pageZoom =
    parseFloat(getComputedStyle(document.body).getPropertyValue("--page-zoom")) || 1;

  devicePreviews.forEach((preview) => {
    const screen = preview.querySelector(".device-screen");
    const frame = preview.querySelector(".preview-frame");
    if (!screen || !frame) {
      return;
    }

    const { width, height } = getViewportSize(preview);
    if (!width || !height) {
      return;
    }

    const rect = screen.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const scale = Math.min(rect.width / width, rect.height / height) / pageZoom;
    preview.style.setProperty("--preview-scale", scale.toString());
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
  });
};

const capturePreview = async (preview) => {
  const frame = preview.querySelector(".preview-frame");
  const frameDoc = frame?.contentDocument;
  if (!frameDoc) {
    return null;
  }

  const { width, height } = getViewportSize(preview);
  if (!width || !height) {
    return null;
  }

  const canvas = await html2canvas(frameDoc.body, {
    backgroundColor: "#0b0b0b",
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
    scale: window.devicePixelRatio || 2,
  });

  return {
    canvas,
    label: preview.dataset.device || "preview",
  };
};

const captureScreen = async () => {
  if (!captureBtn) {
    return;
  }

  if (typeof html2canvas === "undefined") {
    console.warn("html2canvas is not available.");
    return;
  }

  const originalLabel = captureBtn.textContent;
  captureBtn.textContent = "Capturing...";
  captureBtn.disabled = true;

  try {
    const captures = [];
    for (const preview of devicePreviews) {
      const result = await capturePreview(preview);
      if (result) {
        captures.push(result);
      }
    }

    if (!captures.length) {
      return;
    }

    if (captures.length === 1) {
      const link = document.createElement("a");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `intranet-${captures[0].label}-${stamp}.png`;
      link.href = captures[0].canvas.toDataURL("image/png");
      link.click();
      return;
    }

    const gap = 40;
    const totalWidth =
      captures.reduce((sum, item) => sum + item.canvas.width, 0) +
      gap * (captures.length - 1);
    const maxHeight = Math.max(...captures.map((item) => item.canvas.height));

    const output = document.createElement("canvas");
    output.width = totalWidth;
    output.height = maxHeight;
    const ctx = output.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, totalWidth, maxHeight);

    let offsetX = 0;
    captures.forEach((item) => {
      const y = (maxHeight - item.canvas.height) / 2;
      ctx.drawImage(item.canvas, offsetX, y);
      offsetX += item.canvas.width + gap;
    });

    const link = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `intranet-comparison-${stamp}.png`;
    link.href = output.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.warn("Capture failed", error);
  } finally {
    captureBtn.textContent = originalLabel;
    captureBtn.disabled = false;
  }
};

devicePreviews.forEach((preview) => {
  const frame = preview.querySelector(".preview-frame");
  const image = preview.querySelector(".device-image");

  if (frame) {
    frame.addEventListener("load", updateScale);
  }

  if (image) {
    image.addEventListener("load", updateScale);
  }
});

window.addEventListener("resize", updateScale);

if (captureBtn) {
  captureBtn.addEventListener("click", captureScreen);
}

updateScale();
