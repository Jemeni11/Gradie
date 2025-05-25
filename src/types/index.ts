export interface ValidatedFile {
  file: File;
  key: string;
  status: string[];
}

export type ColorFormat =
  | "hsl"
  | "hex"
  | "rgb"
  | "hwb"
  | "lab"
  | "lch"
  | "oklab"
  | "oklch";

export type GradieMode =
  | "Default"
  | "Suprise Me!"
  | "Bold Pop"
  | "Soft Sweep"
  | "Full Blend"
  | "Custom";

export type GradientType = "linear" | "radial" | "conic";

export type GradientPosition =
  | "left"
  | "center"
  | "right"
  | "top"
  | "bottom"
  | "left top"
  | "left center"
  | "left bottom"
  | "center top"
  | "center bottom"
  | "right top"
  | "right center"
  | "right bottom";

export type RadialShape = "circle" | "ellipse";
