import { atomWithReset } from "jotai/utils";
import type { GradieMode } from "@/types";

export const gradieModeAtom = atomWithReset<GradieMode>("Default");
