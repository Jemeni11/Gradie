import { atom } from "jotai";
import type { GradientMode } from "@/types";

export const gradientModeAtom = atom<GradientMode>("Default");
