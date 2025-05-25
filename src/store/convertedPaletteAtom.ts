import { atom } from "jotai";
import { paletteAtom } from "./paletteAtom";
import { colorFormatAtom } from "./colorFormatAtom";
import { colorConverter } from "@/utils";

export const convertedPaletteAtom = atom((get) => {
  const palette = get(paletteAtom);
  const format = get(colorFormatAtom);

  if (!palette) return null;

  return palette.map((hex) => colorConverter(hex, format));
});

export const dominantConvertedColorAtom = atom((get) => {
  const convertedPalette = get(convertedPaletteAtom);
  return convertedPalette?.[0] ?? null;
});
