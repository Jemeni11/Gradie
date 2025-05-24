import { atom } from "jotai";

// The palette is an array of exactly 5 hex colour strings
export const paletteAtom = atom<string[] | null>(null);

export const dominantColorAtom = atom((get) => {
  const palette = get(paletteAtom);
  return palette?.[0] ?? null;
});
