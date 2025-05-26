import Color from "colorjs.io";
import type { ColorFormat } from "@/types";

export default function getMostContrastingColor(
  palette: string[],
  base: string,
  format: ColorFormat,
): string {
  const baseColor = new Color(base);
  let maxContrast = 0;
  let resultColor = palette[0];
  const colorSpace = format === "hex" || format === "rgb" ? "srgb" : format;

  for (const colorStr of palette) {
    const contrast = Math.abs(baseColor.contrast(colorStr, "APCA"));
    if (contrast > maxContrast) {
      maxContrast = contrast;
      resultColor = colorStr;
    }
  }

  const mostConstratingColor = new Color(resultColor)
    .to(colorSpace)
    .toString({ format });

  return mostConstratingColor;
}
