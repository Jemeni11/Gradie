import Color from "colorjs.io";
import colorConverter from "./colorConverter";
import type { ColorFormat } from "@/types";
import { toast } from "sonner";

interface ColorStop {
  color: string;
  position?: number;
}

/**
 * Enhanced gradient banding fix that handles all gradient formats:
 * - Default/Bold Pop/Soft Sweep (2 colors)
 * - Custom (2 colors with custom stops)
 * - Full Blend (3+ colors)
 */
export default function createSteppedGradient(
  gradientString: string,
  outputFormat: ColorFormat,
): string {
  const gradientMatch = gradientString.match(
    /^(linear|radial|conic)-gradient\(([^)]+)\)$/,
  );

  if (!gradientMatch) {
    return gradientString;
  }

  const [, gradientType, params] = gradientMatch;
  const parts = params.split(",").map((part) => part.trim());

  // Parse gradient components
  let direction = "";
  let interpolation = "";
  let colorStart = 0;

  // Check for direction
  if (
    parts[0] &&
    (parts[0].includes("deg") ||
      parts[0].includes("to ") ||
      parts[0].includes("at ") ||
      parts[0].includes("from "))
  ) {
    direction = parts[0];
    colorStart = 1;
  }

  // Check for interpolation method
  if (parts[colorStart] && parts[colorStart].startsWith("in ")) {
    interpolation = parts[colorStart];
    colorStart++;
  }

  // Extract color stops
  const colorStops: ColorStop[] = [];
  const colors = parts.slice(colorStart);

  if (colors.length < 2) {
    return gradientString;
  }

  // Parse colors and their positions
  for (const colorPart of colors) {
    const match = colorPart.match(/^(.+?)\s+(\d+)%$/);
    if (match) {
      // Color with explicit position (Custom mode)
      colorStops.push({
        color: match[1].trim(),
        position: parseInt(match[2]),
      });
    } else {
      // Color without position (Default/Full Blend modes)
      colorStops.push({
        color: colorPart.trim(),
      });
    }
  }

  try {
    let steppedColors: string[] = [];

    if (colorStops.length === 2) {
      // Handle 2-color gradients (Default/Bold Pop/Soft Sweep/Custom)
      steppedColors = handle2ColorGradient(colorStops, outputFormat);
    } else {
      // Handle multi-color gradients (Full Blend)
      steppedColors = handleMultiColorGradient(colorStops, outputFormat);
    }

    // Reconstruct gradient
    const directionPart = direction ? `${direction}, ` : "";
    const interpolationPart = interpolation ? `${interpolation}, ` : "";

    return `${gradientType}-gradient(${directionPart}${interpolationPart}${steppedColors.join(", ")})`;
  } catch (error) {
    toast.warning(`Failed to create stepped gradient: ${error}`);
    console.warn("Failed to create stepped gradient:", error);
    return gradientString;
  }
}

function handle2ColorGradient(
  colorStops: ColorStop[],
  format: ColorFormat,
): string[] {
  const [start, end] = colorStops;
  const startColor = new Color(start.color);
  const endColor = new Color(end.color);

  // If custom stops are provided, use fewer intermediate steps (5-8)
  const hasCustomStops =
    start.position !== undefined || end.position !== undefined;
  const steps = hasCustomStops ? 6 : 15;

  const startPos = start.position ?? 0;
  const endPos = end.position ?? 100;

  const steppedColors: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const position = Math.round(startPos + (endPos - startPos) * progress);

    const interpolated = startColor.mix(endColor, progress);
    const colorString = colorConverter(interpolated.toString(), format);

    steppedColors.push(`${colorString} ${position}%`);
  }

  return steppedColors;
}

function handleMultiColorGradient(
  colorStops: ColorStop[],
  format: ColorFormat,
): string[] {
  const steppedColors: string[] = [];
  const totalColors = colorStops.length;

  // Auto-distribute positions if not provided
  const positions = colorStops.map(
    (stop, index) =>
      stop.position ?? Math.round((index / (totalColors - 1)) * 100),
  );

  // Add steps between each adjacent pair
  for (let i = 0; i < totalColors - 1; i++) {
    const startColor = new Color(colorStops[i].color);
    const endColor = new Color(colorStops[i + 1].color);
    const startPos = positions[i];
    const endPos = positions[i + 1];

    // 6 steps between each pair to keep total manageable
    const steps = 6;

    for (let j = 0; j <= steps; j++) {
      // Skip the end point for intermediate pairs (avoid duplicates)
      if (i < totalColors - 2 && j === steps) continue;

      const progress = j / steps;
      const position = Math.round(startPos + (endPos - startPos) * progress);

      const interpolated = startColor.mix(endColor, progress);
      const colorString = colorConverter(interpolated.toString(), format);

      steppedColors.push(`${colorString} ${position}%`);
    }
  }

  return steppedColors;
}
