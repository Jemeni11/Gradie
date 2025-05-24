import hexToRgb from "./hexToRgb";

// Convert RGB to HSL
function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Get hue from hex
function getHue(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const { h } = rgbToHsl(r, g, b);
  return h;
}

// Calculate hue difference (accounts for circular nature of hue wheel)
function getHueDifference(hue1: number, hue2: number): number {
  const diff = Math.abs(hue1 - hue2);
  return Math.min(diff, 360 - diff);
}

// Get color with most different hue
export default function getMostDifferentHue(palette: string[]): {
  color: string;
  hueDiff: number;
} {
  const dominantColor = palette[0];
  const dominantHue = getHue(dominantColor);
  const otherColors = palette.slice(1);

  let bestColor = otherColors[0];
  let bestHueDiff = getHueDifference(dominantHue, getHue(bestColor));

  for (let i = 1; i < otherColors.length; i++) {
    const currentHue = getHue(otherColors[i]);
    const hueDiff = getHueDifference(dominantHue, currentHue);

    if (hueDiff > bestHueDiff) {
      bestHueDiff = hueDiff;
      bestColor = otherColors[i];
    }
  }

  return { color: bestColor, hueDiff: bestHueDiff };
}
