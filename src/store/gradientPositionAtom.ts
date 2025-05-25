import { atom } from "jotai";
import type { GradientPosition } from "@/types";

export const gradientPositionAtom = atom<GradientPosition>("center");
