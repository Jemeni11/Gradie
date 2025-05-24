import { ValidatedFile } from "@/types";
import { atom } from "jotai";

export const imageAtom = atom<ValidatedFile[]>([]);
