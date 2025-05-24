import hexToRgb from "./hexToRgb";
// Calculate relative luminance
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  // Convert to 0-1 range
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;

  // Apply gamma correction
  const rLinear =
    rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const gLinear =
    gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const bLinear =
    bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Get the most contrasting color from palette
export default function getMostContrastingColor(palette: string[]): {
  color: string;
  ratio: number;
} {
  const dominantColor = palette[0];
  const otherColors = palette.slice(1);

  let bestColor = otherColors[0];
  let bestRatio = getContrastRatio(dominantColor, bestColor);

  for (let i = 1; i < otherColors.length; i++) {
    const ratio = getContrastRatio(dominantColor, otherColors[i]);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestColor = otherColors[i];
    }
  }

  return { color: bestColor, ratio: bestRatio };
}
