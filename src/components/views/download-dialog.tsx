import { useAtomValue, useAtom } from "jotai";
import { useRef, useState } from "react";
import {
  // domToPng,
  domToJpeg,
  domToSvg,
  domToWebp,
  type Options,
} from "modern-screenshot";
// import { toPng, toJpeg, toPixelData, toSvg } from "html-to-image";
// import html2canvas from "html-to-canvas";
import * as htmlToImage from "html-to-image";
import {
  gradientStringAtom,
  downloadConfigAtom,
  previewDimensionsAtom,
  // selectedDimensionsAtom,
  selectedFormatAtom,
  selectedFilenameAtom,
  dimensionModeAtom,
} from "@/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { DimensionMode, FileFormat } from "@/types";
import { supportedDownloadFormats, dimensionModes } from "@/constants";
import GradientPreview from "./gradient-preview";
import { toast } from "sonner";

export default function DownloadDialog() {
  const gradientString = useAtomValue(gradientStringAtom);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadConfig = useAtomValue(downloadConfigAtom);
  const previewDimensions = useAtomValue(previewDimensionsAtom);
  // const [selectedDimensions, setSelectedDimensions] = useAtom(
  //   selectedDimensionsAtom,
  // );
  const [selectedFormat, setSelectedFormat] = useAtom(selectedFormatAtom);
  const [filename, setFilename] = useAtom(selectedFilenameAtom);
  const [dimensionMode, setDimensionMode] = useAtom(dimensionModeAtom);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);

    try {
      // Get the format config
      const formatConfig = supportedDownloadFormats.find(
        (f) => f.name === selectedFormat,
      );
      if (!formatConfig)
        throw new Error(`Unsupported format: ${selectedFormat}`);

      // Use previewDimensions for the actual export dimensions
      const dimensions = previewDimensions;

      // Export options
      const exportOptions: Options = {
        width: dimensions.width,
        height: dimensions.height,
        quality: formatConfig.quality ? downloadConfig.quality : undefined,
        style: {
          border: "none",
        },
        type:
          selectedFormat === "svg"
            ? "image/svg+xml"
            : `image/${selectedFormat}`,
      };

      let dataUrl: string;

      console.log(exportOptions);

      // Export based on format
      switch (selectedFormat) {
        case "png":
          dataUrl = await htmlToImage.toPng(previewRef.current, {
            width: exportOptions.width,
            height: exportOptions.height,
            skipFonts: true,
            style: {
              border: "none",
            },
          });
          console.log(dataUrl);
          // dataUrl = await domToPng(previewRef.current, exportOptions);
          break;
        case "webp":
          dataUrl = await domToWebp(previewRef.current, exportOptions);
          break;
        case "jpeg":
          dataUrl = await domToJpeg(previewRef.current, exportOptions);
          break;
        case "svg":
          dataUrl = await domToSvg(previewRef.current, {
            width: dimensions.width,
            height: dimensions.height,
          });
          break;
        default:
          throw new Error(`Unsupported format: ${selectedFormat}`);
      }

      // Create download
      const link = document.createElement("a");
      link.download = `${filename || "gradie-gradient"}.${formatConfig.ext}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="border-gradie-2 bg-gradie-2 flex-1 cursor-pointer rounded-lg border border-solid px-4 py-2 font-bold text-white"
          type="button"
        >
          <span>Download</span>
          {/* ICON */}
        </button>
      </DialogTrigger>
      <DialogContent className="w-[80vw]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold">
            Download gradient
          </DialogTitle>
          <DialogDescription className="hidden">
            Gradient Download Dialog
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <div className="w-full">
            <GradientPreview ref={previewRef} gradient={gradientString} />
          </div>
          <div className="flex w-full flex-col gap-4">
            <div>
              <label htmlFor="fileformat">File format</label>

              <Select
                value={selectedFormat}
                onValueChange={(value) =>
                  setSelectedFormat(value as FileFormat)
                }
              >
                <SelectTrigger id="fileformat" className="mt-4 w-full">
                  <SelectValue aria-label={selectedFormat}>
                    {selectedFormat}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {supportedDownloadFormats.map((format) => (
                    <SelectItem key={format.name} value={format.name}>
                      {format.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="filename">Filename</label>
              <div className="relative mt-4 inline-flex w-full items-center">
                <Input
                  id="filename"
                  value={filename}
                  type="text"
                  inputMode="text"
                  onChange={(e) => {
                    let userFilename = e.target.value;

                    if (userFilename.length > 255) {
                      userFilename = userFilename.substring(0, 255);
                    }

                    setFilename(userFilename);
                  }}
                  className="w-full pr-14"
                  placeholder="gradie-gradient"
                />
                <small className="absolute right-4 font-light">
                  {255 - filename.length}
                </small>
              </div>
            </div>
            <div>
              <label htmlFor="dimensionMode">Dimension Mode</label>

              <Select
                value={dimensionMode}
                onValueChange={(value) =>
                  setDimensionMode(value as DimensionMode)
                }
              >
                <SelectTrigger id="dimensionMode" className="mt-4 w-full">
                  <SelectValue aria-label={dimensionMode}>
                    {dimensionMode}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {dimensionModes.map((mode) => (
                    <SelectItem key={mode.name} value={mode.name}>
                      <p className="flex flex-col">
                        <span className="mb-2">{mode.name}</span>
                        <small>{mode.definition}</small>
                      </p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Export size: {previewDimensions.width} × {previewDimensions.height}px
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="mr-4 cursor-pointer px-8 py-4"
              type="button"
              disabled={isDownloading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer px-8 py-4"
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
