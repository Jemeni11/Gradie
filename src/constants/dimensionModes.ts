import type { DimensionModeObject } from "@/types";

const dimensionModes: DimensionModeObject[] = [
  {
    name: "preset",
    definition: "Choose from predefined sizes",
  },
  {
    name: "aspect-ratio",
    definition: "Pick ratio + one dimension",
  },
  {
    name: "custom",
    definition: "Free-form width/height",
  },
  {
    name: "original",
    definition: "Use uploaded image dimensions",
  },
  {
    name: "viewport",
    definition: "Use browser window size",
  },
];

export default dimensionModes;
