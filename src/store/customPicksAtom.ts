import { atom } from "jotai";

export const customPickStartAtom = atom<string | null>(null);
export const customPickEndAtom = atom<string | null>(null);
export const customPickStopAtom = atom<number>(50);
