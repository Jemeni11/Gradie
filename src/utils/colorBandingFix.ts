const MAX_SUPERSAMPLED_PIXELS = 32_000_000;
const DEFAULT_SUPERSAMPLE_SCALE = 2;
const DEFAULT_DITHER_AMOUNT = 1.5;

export function getGradientExportScale(width: number, height: number): number {
  const pixelCount = width * height;

  if (pixelCount <= 0) {
    return 1;
  }

  const cappedScale = Math.sqrt(MAX_SUPERSAMPLED_PIXELS / pixelCount);
  return Math.max(1, Math.min(DEFAULT_SUPERSAMPLE_SCALE, cappedScale));
}

export function downsampleCanvas(sourceCanvas: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = width;
  outputCanvas.height = height;

  const context = outputCanvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare export canvas");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, width, height);

  return outputCanvas;
}

export function applyCanvasDithering(canvas: HTMLCanvasElement, amount = DEFAULT_DITHER_AMOUNT): void {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not read export canvas");
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;

      if (data[index + 3] === 0) {
        continue;
      }

      const noiseR = (hashNoise(x, y, 0) - 0.5) * amount * 2;
      const noiseG = (hashNoise(x, y, 1) - 0.5) * amount * 2;
      const noiseB = (hashNoise(x, y, 2) - 0.5) * amount * 2;
      data[index] = clampColorChannel(data[index] + noiseR);
      data[index + 1] = clampColorChannel(data[index + 1] + noiseG);
      data[index + 2] = clampColorChannel(data[index + 2] + noiseB);
    }
  }

  context.putImageData(imageData, 0, 0);
}

function hashNoise(x: number, y: number, channel = 0): number {
  let hash = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(channel, 2147483647);
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
  return ((hash ^ (hash >>> 16)) >>> 0) / 4_294_967_295;
}

function clampColorChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
