import {
  getRandomFromSlice,
  getMostContrastingColor,
  getMostDifferentHue,
  copyToClipboard,
} from "@/utils";
import { colorInterpolationMethodMapper } from "@/constants";
import type { GradieMode, GradientType } from "@/types";
import { useAtomValue } from "jotai";
import {
  customPickStartAtom,
  customPickEndAtom,
  customPickStopAtom,
  gradientAngleAtom,
  gradientPositionAtom,
  radialShapeAtom,
  dominantConvertedColorAtom,
  convertedPaletteAtom,
  colorFormatAtom,
} from "@/store";

export default function GradientArea({
  gradieMode,
  gradientType,
}: {
  gradieMode: GradieMode;
  gradientType: GradientType;
}) {
  const start = useAtomValue(customPickStartAtom);
  const end = useAtomValue(customPickEndAtom);
  const stop = useAtomValue(customPickStopAtom);

  const angle = useAtomValue(gradientAngleAtom);
  const position = useAtomValue(gradientPositionAtom);

  const radialShape = useAtomValue(radialShapeAtom);

  const dominant = useAtomValue(dominantConvertedColorAtom);
  const palette = useAtomValue(convertedPaletteAtom);
  const colorFormat = useAtomValue(colorFormatAtom);

  if (!palette || !dominant) {
    return <div>No palette available</div>;
  }

  const paletteWithoutDominant = palette.slice(1);
  const interpolation = colorInterpolationMethodMapper[colorFormat];

  const getGradientDirection = () => {
    if (gradientType === "linear") {
      return `${angle}deg`;
    } else if (gradientType === "radial") {
      return `${radialShape} at ${position}`;
    } else if (gradientType === "conic") {
      return `from ${angle}deg at ${position}`;
    }
    return "";
  };

  const direction = getGradientDirection();

  const getDirectionWithComma = () => {
    if (!direction) return "";

    if (interpolation) {
      return `${direction} `;
    }
    return `${direction}, `;
  };

  const directionWithComma = getDirectionWithComma();

  let gradientString = "";

  switch (gradieMode) {
    case "Default":
      gradientString = `${gradientType}-gradient(${directionWithComma}${interpolation}${dominant}, ${palette[1]})`;
      break;

    case "Suprise Me!":
      gradientString = `${gradientType}-gradient(${directionWithComma}${interpolation}${dominant}, ${getRandomFromSlice(palette, 1)})`;
      break;

    case "Bold Pop":
      gradientString = `${gradientType}-gradient(${directionWithComma}${interpolation}${dominant}, ${getMostContrastingColor(paletteWithoutDominant, dominant, colorFormat)})`;
      break;

    case "Soft Sweep":
      gradientString = `${gradientType}-gradient(${directionWithComma}${interpolation}${dominant}, ${getMostDifferentHue(paletteWithoutDominant, dominant, colorFormat)})`;
      break;

    case "Full Blend":
      gradientString = `${gradientType}-gradient(${directionWithComma}${interpolation}${palette.join(", ")})`;
      break;

    case "Custom":
      if (start && end) {
        gradientString = `${gradientType}-gradient(${directionWithComma}${interpolation}${start} ${stop}%, ${end})`;
      } else {
        gradientString = `${gradientType}-gradient(${directionWithComma}${interpolation}${dominant}, ${palette[1]})`;
      }
      break;
  }

  const copyGradientCSS = () => {
    copyToClipboard(gradientString, "CSS copied to clipboard!");
  };

  return (
    <>
      <div
        className="border-gradie-1 aspect-video w-full rounded-lg border border-solid"
        style={{
          backgroundImage: gradientString,
        }}
      />
      <button
        className="border-gradie-2 cursor-pointer rounded-lg border border-solid px-4 py-2 text-black"
        onClick={copyGradientCSS}
        type="button"
      >
        Copy Gradient
      </button>
    </>
  );
}
