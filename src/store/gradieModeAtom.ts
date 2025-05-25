import { atom } from "jotai";
import type { GradieMode } from "@/types";

export const gradieModeAtom = atom<GradieMode>("Default");
