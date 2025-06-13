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
  | "Surprise Me!"
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
  | "left bottom"
  | "right top"
  | "right bottom";

export type RadialShape = "circle" | "ellipse";

export type FileFormat = "webp" | "png" | "jpeg" | "svg";

export type DimensionPreset =
  | "square-1080"
  | "square-1200"
  | "vertical-story"
  | "vertical-mobile-wallpaper"
  | "horizontal-twitter"
  | "horizontal-og"
  | "portrait-post"
  | "youtube-thumbnail"
  | "youtube-banner"
  | "fhd-landscape"
  | "uhd-landscape"
  | "ultrawide"
  | "blog-header"
  | "email-header"
  | "tablet-wallpaper";

export type PresetCategory = "social" | "wallpaper" | "presentation" | "web";

export type DimensionPresetObjectArray = {
  key: DimensionPreset;
  width: number;
  height: number;
  label: string;
  useCases: string[];
  category: PresetCategory;
}[];

export type AspectRatio =
  | "square"
  | "landscape"
  | "portrait"
  | "widescreen"
  | "classic"
  | "golden"
  | "cinematic";

export type DimensionMode =
  // Choose from predefined sizes
  | "preset"
  // Pick ratio + one dimension
  | "aspect-ratio"
  // Free-form width/height
  | "custom"
  // Use uploaded image dimensions
  | "original"
  // Use browser window size
  | "viewport";

export type DimensionModeObject = { name: DimensionMode; definition: string };

export interface DownloadConfig {
  // File settings
  format: FileFormat;
  filename: string;
  quality: number; // 0-100, only applies to lossy formats

  // Dimension settings
  dimensionMode: DimensionMode;
  preset?: DimensionPreset;
  aspectRatio?: AspectRatio;
  width: number;
  height: number;
  maintainAspectRatio: boolean;

  // Advanced options
  includeMetadata: boolean; // EXIF data, etc
  backgroundColor?: string; // for formats that don't support transparency
}
