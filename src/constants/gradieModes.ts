import type { GradieMode } from "@/types";

const gradieModes: { name: GradieMode; description: string }[] = [
  {
    name: "Default",
    description: "Most prominent color + second-most prominent",
  },
  {
    name: "Surprise Me!",
    description:
      "Most prominent color + a random pick from the rest of the palette",
  },
  {
    name: "Bold Pop",
    description:
      "Most prominent color + the most visually contrasting color in the palette",
  },
  {
    name: "Soft Sweep",
    description:
      "Most prominent color + the palette color with the most different hue",
  },
  {
    name: "Full Blend",
    description: "Uses all five palette colors to create a multi-stop gradient",
  },
  {
    name: "Custom",
    description:
      "You choose any two colors from the extracted palette to create your own combo",
  },
];

export default gradieModes;
