import Color from "colorjs.io";
import { ColorFormat } from "@/types";

export default function getMostDifferentHue(
  palette: string[],
  base: string,
  format: ColorFormat,
): string {
  const baseColor = new Color(base).to("oklch");
  let maxDeltaH = -1;
  let resultColor = palette[0];
  const colorSpace = format === "hex" || format === "rgb" ? "srgb" : format;

  for (const colorStr of palette) {
    const current = new Color(colorStr).to("oklch");
    const deltaH = Math.abs((current.h || 0) - (baseColor.h || 0));
    const hueDiff = deltaH > 180 ? 360 - deltaH : deltaH;

    if (hueDiff > maxDeltaH) {
      maxDeltaH = hueDiff;
      resultColor = colorStr;
    }
  }

  return new Color(resultColor).to(colorSpace).toString({ format });
}
