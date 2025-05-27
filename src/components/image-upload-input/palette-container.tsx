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
      <div className="flex w-full justify-between gap-x-8 rounded-lg">
        {palette?.map((paletteColor) => (
          <button
            type="button"
            key={`${paletteColor}`}
            className="flex cursor-pointer flex-col items-center"
            onClick={() => copyToClipboard(`${paletteColor}`, "Color copied!")}
          >
            <span
              className="size-20 rounded-xl"
              style={{ background: `${paletteColor}` }}
              key={`${paletteColor}`}
            />
            <small className="w-full max-w-20 py-2 text-center text-xs text-pretty whitespace-normal text-black">
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
