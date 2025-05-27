import { atomWithReset } from "jotai/utils";
import { ValidatedFile } from "@/types";

export const imageAtom = atomWithReset<ValidatedFile[]>([]);
