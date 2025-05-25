import { atom } from "jotai";
import type { ColorFormat } from "@/types";

export const colorFormatAtom = atom<ColorFormat>("hex");
