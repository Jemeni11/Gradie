import {
  getRandomFromSlice,
  getMostContrastingColor,
  getMostDifferentHue,
  copyToClipboard,
} from "@/utils";
import { colorInterpolationMethodMapper } from "@/constants";
import type { ColorFormat, GradieMode, GradientType } from "@/types";
import { useAtomValue } from "jotai";
import {
  customPickStartAtom,
  customPickEndAtom,
  customPickStopAtom,
  gradientAngleAtom,
  gradientPositionAtom,
  radialShapeAtom,
} from "@/store";

export default function GradientArea({
  dominant,
  palette,
  gradieMode,
  gradientType,
  colorFormat,
}: {
  dominant: string;
  palette: string[];
  gradieMode: GradieMode;
  gradientType: GradientType;
  colorFormat: ColorFormat;
}) {
  const start = useAtomValue(customPickStartAtom);
  const end = useAtomValue(customPickEndAtom);
  const stop = useAtomValue(customPickStopAtom);

  const angle = useAtomValue(gradientAngleAtom);
  const position = useAtomValue(gradientPositionAtom);

  const radialShape = useAtomValue(radialShapeAtom);

  if (!palette || !dominant) {
    return <div>No palette available</div>;
  }

  const interpolation = colorInterpolationMethodMapper[colorFormat];

  const getGradientDirection = () => {
    if (gradientType === "linear") {
      return `${angle}deg, `;
    } else if (gradientType === "radial") {
      return `${radialShape} at ${position}, `;
    } else if (gradientType === "conic") {
      return `from ${angle}deg at ${position}, `;
    }
    return "";
  };

  const direction = getGradientDirection();

  let gradientString = "";

  switch (gradieMode) {
    case "Default":
      gradientString = `${gradientType}-gradient(${direction}${interpolation}${dominant}, ${palette[1]})`;
      break;

    case "Suprise Me!":
      gradientString = `${gradientType}-gradient(${direction}${interpolation}${dominant}, ${getRandomFromSlice(palette, 1)})`;
      break;

    case "Bold Pop":
      gradientString = `${gradientType}-gradient(${direction}${interpolation}${dominant}, ${getMostContrastingColor(palette).color})`;
      break;

    case "Soft Sweep":
      gradientString = `${gradientType}-gradient(${direction}${interpolation}${dominant}, ${getMostDifferentHue(palette).color})`;
      break;

    case "Full Blend":
      gradientString = `${gradientType}-gradient(${direction}${interpolation}${palette.join(", ")})`;
      break;

    case "Custom":
      if (start && end) {
        gradientString = `${gradientType}-gradient(${direction}${interpolation}${start} ${stop}%, ${end})`;
      } else {
        gradientString = `${gradientType}-gradient(${direction}${interpolation}${dominant}, ${palette[1]})`;
      }
      break;
  }

  console.log(gradientString);

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
