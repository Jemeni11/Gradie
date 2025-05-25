import { atom } from "jotai";
import type { GradientType } from "@/types";

export const gradientTypeAtom = atom<GradientType>("linear");
