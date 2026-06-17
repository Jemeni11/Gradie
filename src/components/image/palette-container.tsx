import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "@/icons";
import { copyToClipboard } from "@/utils";

import type { ColorThiefColor } from "@/hooks/useColorThief";

export default function PaletteContainer({ palette }: { palette: ColorThiefColor[] }) {
  return (
    <>
      <div className="grid w-full grid-cols-5 gap-2 rounded-lg sm:flex sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-2 lg:gap-x-4">
        {palette?.map((paletteColor) => (
          <button
            type="button"
            key={`${paletteColor}`}
            className="flex flex-1 cursor-pointer flex-col items-center"
            onClick={() => copyToClipboard(`${paletteColor}`, "Color copied!")}
          >
            <span
              className="aspect-square w-full rounded shadow-gradie-2 sm:aspect-auto sm:h-20 sm:w-full lg:rounded-xl"
              style={{ background: `${paletteColor}` }}
            />
            <small className="hidden w-full py-2 text-center text-pretty whitespace-normal text-black sm:block md:max-w-20 md:text-xs">
              {paletteColor}
            </small>
          </button>
        ))}
      </div>
      <Alert className="mt-4 border-gradie-2">
        <InfoIcon className="size-4 animate-pulse motion-reduce:animate-none" />
        <AlertTitle>Quick tip</AlertTitle>
        <AlertDescription>Click any color to copy its value</AlertDescription>
      </Alert>
    </>
  );
}
