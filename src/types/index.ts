export interface ValidatedFile {
  file: File;
  key: string;
  status: string[];
}

export type ColorFormat = "oklch" | "hex" | "rgb" | "hsl";

export type GradientMode =
  | "Default"
  | "Suprise Me!"
  | "Bold Pop"
  | "Soft Sweep"
  | "Full Blend"
  | "Custom";
