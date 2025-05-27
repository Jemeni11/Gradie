import { atomWithReset } from "jotai/utils";
import type { GradientType } from "@/types";

export const gradientTypeAtom = atomWithReset<GradientType>("linear");
