import { downloadAspectRatios } from "@/constants";
import type { AspectRatio } from "@/types";

const calculateAspectRatioDimensions = (
  aspectRatio: AspectRatio,
  knownDimension: "width" | "height",
  value: number,
) => {
  const ratio = downloadAspectRatios[aspectRatio].ratio;

  if (knownDimension === "width") {
    return {
      width: value,
      height: Math.round(value / ratio),
    };
  } else {
    return {
      width: Math.round(value * ratio),
      height: value,
    };
  }
};

export default calculateAspectRatioDimensions;
