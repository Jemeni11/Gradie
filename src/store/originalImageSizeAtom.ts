import { atomWithReset } from "jotai/utils";

export const originalImageSizeAtom = atomWithReset({
  width: 0,
  height: 0,
});
