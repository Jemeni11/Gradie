import Color from "colorjs.io";
import type { ColorFormat } from "@/types";

export default function colorConverter(
  colorString: string,
  format: ColorFormat,
): string {
  const color = new Color(colorString);

  switch (format) {
    case "hex":
      return color.to("srgb").toString({ format: "hex" });
    case "rgb":
      return color.to("srgb").toString({ format: "srgb" });
    case "hsl":
      return color.to("hsl").toString({ format: "hsl" });
    case "hwb":
      return color.to("hwb").toString({ format: "hwb" });
    case "lab":
      return color.to("lab").toString({ format: "lab" });
    case "lch":
      return color.to("lch").toString({ format: "lch" });
    case "oklab":
      return color.to("oklab").toString({ format: "oklab" });
    case "oklch":
      return color.to("oklch").toString({ format: "oklch" });
    default:
      return colorString;
  }
}
