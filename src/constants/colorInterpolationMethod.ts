import type { ColorFormat } from "@/types";

const colorInterpolationMethodMapper: Record<ColorFormat, string> = {
  hsl: "in hsl, ",
  hex: "", // in srgb, browser default
  rgb: "", // in srgb, browser default
  hwb: "in hwb, ",
  lab: "in lab, ",
  lch: "in lch, ",
  oklab: "in oklab, ",
  oklch: "in oklch, ",
};

export default colorInterpolationMethodMapper;
