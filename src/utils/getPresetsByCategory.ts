import type { PresetCategory, DimensionPreset } from "@/types";
import { dimensionPresets } from "@/constants";

const getPresetsByCategory = (category: PresetCategory) => {
  return Object.entries(dimensionPresets)
    .filter(([, preset]) => preset.category === category)
    .map(([key, preset]) => ({ key: key as DimensionPreset, ...preset }));
};

export default getPresetsByCategory;
