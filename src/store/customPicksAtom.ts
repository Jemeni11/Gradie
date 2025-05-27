import { atomWithReset } from "jotai/utils";

export const customPickStartAtom = atomWithReset<string>("");
export const customPickEndAtom = atomWithReset<string>("");
export const customPickStopAtom = atomWithReset<number>(50);
