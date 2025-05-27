import { atomWithReset } from "jotai/utils";
import type { RadialShape } from "@/types";

export const radialShapeAtom = atomWithReset<RadialShape>("circle");
