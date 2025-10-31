import { useAtom } from "jotai";
import { colorFormatAtom } from "@/store";
import { OptionsIcon } from "@/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorFormat } from "@/types";
import { supportedColorFormats } from "@/constants";

export default function Header() {
  const [colorFormat, setColorFormat] = useAtom(colorFormatAtom);

  return (
    <header className="mb-8 flex items-center justify-between py-4">
      <div className="flex items-center gap-x-2">
        <img
          src="/favicon-32x32.png"
          alt="Gradie's logo"
          width={32}
          height={32}
        />
        <span className="font-aladin text-2xl">Gradie</span>
      </div>
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              aria-label="Color Format Selector"
            >
              <OptionsIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4 w-fit">
            <DropdownMenuLabel className="font-aladin text-2xl">
              Color Format
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={colorFormat}
              onValueChange={(value) => setColorFormat(value as ColorFormat)}
            >
              {supportedColorFormats.map((format) => (
                <DropdownMenuRadioItem
                  key={format}
                  value={format}
                  className="cursor-pointer"
                >
                  <span>{format}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
