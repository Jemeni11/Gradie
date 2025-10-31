import type { ColorThiefColor } from "@/hooks/useColorThief";
import { copyToClipboard } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "@/icons";

export default function PaletteContainer({
  palette,
}: {
  palette: ColorThiefColor[];
}) {
  return (
    <>
      <div className="flex w-full flex-col justify-between gap-y-4 rounded-lg sm:flex-row sm:flex-wrap sm:gap-x-2 lg:gap-x-4">
        {/* <div className="flex w-full flex-col justify-between gap-y-4 rounded-lg md:flex-row md:flex-wrap md:gap-x-1 xl:gap-x-8"> */}
        {palette?.map((paletteColor) => (
          <button
            type="button"
            key={`${paletteColor}`}
            className="flex flex-1 cursor-pointer flex-col items-center"
            onClick={() => copyToClipboard(`${paletteColor}`, "Color copied!")}
          >
            <span
              // className="shadow-gradie-2 h-20 w-[100%] rounded min-[900px]:size-14 md:size-10 md:rounded-xl lg:size-20"
              className="shadow-gradie-2 h-20 w-[100%] rounded md:w-[100%] lg:rounded-xl"
              style={{ background: `${paletteColor}` }}
              key={`${paletteColor}`}
            />
            <small className="w-full py-2 text-center text-base text-pretty whitespace-normal text-black md:max-w-20 md:text-xs">
              {paletteColor}
            </small>
          </button>
        ))}
      </div>
      <Alert className="border-gradie-2 mt-4">
        <InfoIcon className="size-4 animate-pulse motion-reduce:animate-none" />
        <AlertTitle>Quick tip</AlertTitle>
        <AlertDescription>Click any color to copy its value</AlertDescription>
      </Alert>
    </>
  );
}
