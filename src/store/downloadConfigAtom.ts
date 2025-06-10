import { atom } from "jotai";
import type { FileFormat, DownloadConfig, DimensionMode } from "@/types";
import { dimensionPresets } from "@/constants";

// Core download config
export const downloadConfigAtom = atom<DownloadConfig>({
  format: "webp",
  filename: "gradie-gradient",
  quality: 90,

  dimensionMode: "original",
  width: 1200,
  height: 800,
  maintainAspectRatio: true,

  includeMetadata: false,
});

// Derived atoms for UI convenience
export const selectedFormatAtom = atom(
  (get) => get(downloadConfigAtom).format,
  (get, set, format: FileFormat) => {
    set(downloadConfigAtom, { ...get(downloadConfigAtom), format });
  },
);

export const selectedFilenameAtom = atom(
  (get) => get(downloadConfigAtom).filename,
  (get, set, filename: string) => {
    set(downloadConfigAtom, { ...get(downloadConfigAtom), filename });
  },
);

export const dimensionModeAtom = atom(
  (get) => get(downloadConfigAtom).dimensionMode,
  (get, set, dimensionMode: DimensionMode) => {
    set(downloadConfigAtom, { ...get(downloadConfigAtom), dimensionMode });
  },
);

export const selectedDimensionsAtom = atom(
  (get) => {
    const config = get(downloadConfigAtom);
    return { width: config.width, height: config.height };
  },
  (get, set, dimensions: { width: number; height: number }) => {
    set(downloadConfigAtom, { ...get(downloadConfigAtom), ...dimensions });
  },
);

export const previewDimensionsAtom = atom((get) => {
  const config = get(downloadConfigAtom);

  switch (config.dimensionMode) {
    case "preset":
      return config.preset
        ? dimensionPresets[config.preset]
        : { width: config.width, height: config.height };
    case "viewport":
      return { width: window.innerWidth, height: window.innerHeight };
    default:
      return { width: config.width, height: config.height };
  }
});
