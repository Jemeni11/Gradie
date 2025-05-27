import { atomWithReset } from "jotai/utils";
import type { GradientPosition } from "@/types";

export const gradientPositionAtom = atomWithReset<GradientPosition>("center");
