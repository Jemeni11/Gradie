import { atom } from "jotai";
import type { DownloadConfig } from "@/types";

// Core download config
export const downloadConfigAtom = atom<DownloadConfig>({
  format: "png",
  filename: "gradie-gradient",
  quality: 100,

  dimensionMode: "original",
  width: 1200,
  height: 800,
  maintainAspectRatio: true,

  includeMetadata: false,
  preset: "horizontal-og",
});
