import { atomWithReset } from "jotai/utils";
import type { ColorFormat } from "@/types";

export const colorFormatAtom = atomWithReset<ColorFormat>("hex");
