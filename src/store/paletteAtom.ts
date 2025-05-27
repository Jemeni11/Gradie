import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// The palette is an array of exactly 5 hex color strings
export const paletteAtom = atomWithReset<string[] | null>(null);

export const dominantColorAtom = atom((get) => {
  const palette = get(paletteAtom);
  return palette?.[0] ?? null;
});
