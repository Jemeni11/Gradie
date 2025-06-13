import { useAtomValue, useAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import {
  // domToPng,
  domToJpeg,
  domToSvg,
  domToWebp,
} from "modern-screenshot";
import * as htmlToImage from "html-to-image";
import {
  gradientStringAtom,
  originalImageSizeAtom,
  downloadConfigAtom,
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
import type {
  DimensionMode,
  DimensionPreset,
  DownloadConfig,
  FileFormat,
  AspectRatio,
} from "@/types";
import {
  supportedDownloadFormats,
  dimensionModes,
  dimensionPresets,
  downloadAspectRatios,
} from "@/constants";
import { useWindowSize } from "@/hooks/useWindowSize";
import GradientPreview from "./gradient-preview";
import { toast } from "sonner";

export default function DownloadDialog() {
  const gradientString = useAtomValue(gradientStringAtom);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [downloadConfig, setDownloadConfig] = useAtom(downloadConfigAtom);
  const originalImageSize = useAtomValue(originalImageSizeAtom);
  const { height: browserHeight, width: browserWidth } = useWindowSize();

  const exportDimensions = useMemo(() => {
    const preset = dimensionPresets.find(
      (p) => p.key === downloadConfig.preset,
    );

    const aspectRatio = downloadConfig.aspectRatio
      ? downloadAspectRatios[downloadConfig.aspectRatio]
      : null;

    switch (downloadConfig.dimensionMode) {
      case "viewport":
        return { width: browserWidth, height: browserHeight };
      case "original":
        return {
          width: originalImageSize.width || 1200,
          height: originalImageSize.height || 800,
        };
      case "preset":
        return preset
          ? { width: preset.width, height: preset.height }
          : { width: downloadConfig.width, height: downloadConfig.height };
      case "aspect-ratio":
        if (aspectRatio) {
          const ratio = aspectRatio.ratio;
          const width = downloadConfig.width;
          const height = downloadConfig.height;

          // Use whichever dimension is set (non-zero) to calculate the other
          if (width > 0 && height <= 0) {
            return { width, height: Math.round(width / ratio) };
          } else if (height > 0 && width <= 0) {
            return { width: Math.round(height * ratio), height };
          } else if (width > 0 && height > 0) {
            // Both are set, use width as primary and calculate height
            return { width, height: Math.round(width / ratio) };
          }
        }
        return { width: downloadConfig.width, height: downloadConfig.height };
      case "custom":
      default:
        return { width: downloadConfig.width, height: downloadConfig.height };
    }
  }, [downloadConfig, browserWidth, browserHeight, originalImageSize]);

  const handleDownload = async () => {
    if (!previewRef.current) {
      toast.error("Preview not ready");
      return;
    }

    setIsDownloading(true);

    try {
      const fileFormatConfig = supportedDownloadFormats.find(
        (f) => f.name === downloadConfig.format,
      );

      if (!fileFormatConfig) {
        throw new Error(`Unsupported format: ${downloadConfig.format}`);
      }

      const exportOptions = {
        width: exportDimensions.width,
        height: exportDimensions.height,
        quality: fileFormatConfig.quality
          ? downloadConfig.quality / 100
          : undefined,
        style: {
          border: "none",
          borderRadius: "0px",
        },
      };

      let dataUrl: string;

      switch (downloadConfig.format) {
        case "png":
          dataUrl = await htmlToImage.toPng(previewRef.current, {
            ...exportOptions,
            skipFonts: true,
          });
          break;
        case "webp":
          dataUrl = await domToWebp(previewRef.current, exportOptions);
          break;
        case "jpeg":
          dataUrl = await domToJpeg(previewRef.current, exportOptions);
          break;
        case "svg":
          dataUrl = await domToSvg(previewRef.current, exportOptions);
          break;
        default:
          throw new Error(`Unsupported format: ${downloadConfig.format}`);
      }

      // Create and trigger download
      const link = document.createElement("a");
      const filename = downloadConfig.filename || "gradie-gradient";
      link.download = `${filename}.${fileFormatConfig.ext}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download completed!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(
        `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDimensionModeChange = (newMode: DimensionMode) => {
    let newDimensions = {
      width: downloadConfig.width,
      height: downloadConfig.height,
    };
    const updates: Partial<DownloadConfig> = { dimensionMode: newMode };

    const preset = dimensionPresets.find(
      (p) => p.key === downloadConfig.preset,
    );

    switch (newMode) {
      case "viewport":
        newDimensions = { width: browserWidth, height: browserHeight };
        break;
      case "original":
        newDimensions = {
          width: originalImageSize.width || 1200,
          height: originalImageSize.height || 800,
        };
        break;
      case "preset":
        if (preset) {
          newDimensions = { width: preset.width, height: preset.height };
        }
        break;
      case "aspect-ratio":
        // Set default aspect ratio if not already set
        if (!downloadConfig.aspectRatio) {
          updates.aspectRatio = "landscape";
        }
        // Set a default width if both dimensions are 0
        if (downloadConfig.width <= 0 && downloadConfig.height <= 0) {
          newDimensions = { width: 1920, height: 0 }; // Will be calculated based on ratio
        }
        break;
      // For custom, keep current dimensions
    }

    setDownloadConfig({
      ...downloadConfig,
      ...updates,
      ...newDimensions,
    });
  };

  const handlePresetChange = (presetKey: DimensionPreset) => {
    const preset = dimensionPresets.find((p) => p.key === presetKey);
    if (preset) {
      setDownloadConfig({
        ...downloadConfig,
        preset: presetKey,
        width: preset.width,
        height: preset.height,
      });
    }
  };

  const updateFilename = (newFilename: string) => {
    // Sanitize filename and limit length
    const sanitized = newFilename
      .replace(/[<>:"/\\|?*]/g, "")
      .substring(0, 255);

    setDownloadConfig({
      ...downloadConfig,
      filename: sanitized,
    });
  };

  const handleAspectRatioChange = (newRatio: AspectRatio) => {
    const newAspectRatio = downloadAspectRatios[newRatio];
    const ratio = newAspectRatio.ratio;

    // Keep the current dimensions as starting point
    let newWidth = downloadConfig.width;
    let newHeight = downloadConfig.height;

    // If we have a valid width, recalculate height
    if (newWidth > 0) {
      newHeight = Math.round(newWidth / ratio);
    }
    // If we don't have a valid width but have height, recalculate width
    else if (newHeight > 0) {
      newWidth = Math.round(newHeight * ratio);
    }
    // If neither dimension is set, use a default width and calculate height
    else {
      newWidth = 1920; // Default width
      newHeight = Math.round(newWidth / ratio);
    }

    setDownloadConfig({
      ...downloadConfig,
      aspectRatio: newRatio,
      width: newWidth,
      height: newHeight,
    });
  };

  const handleAspectRatioDimensionChange = (
    field: "width" | "height",
    value: number,
  ) => {
    const aspectRatio = downloadConfig.aspectRatio
      ? downloadAspectRatios[downloadConfig.aspectRatio]
      : null;

    if (!aspectRatio) {
      setDownloadConfig({
        ...downloadConfig,
        [field]: value,
      });
      return;
    }

    const ratio = aspectRatio.ratio;
    let newWidth = value;
    let newHeight = value;

    if (field === "width") {
      newHeight = Math.round(value / ratio);
    } else {
      newWidth = Math.round(value * ratio);
    }

    setDownloadConfig({
      ...downloadConfig,
      width: newWidth,
      height: newHeight,
    });
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
          <div className="flex h-full w-full flex-col justify-between">
            <GradientPreview ref={previewRef} gradient={gradientString} />
            <div className="rounded bg-gray-50 p-3 text-sm text-gray-600">
              <strong>Export size:</strong> {exportDimensions.width} ×{" "}
              {exportDimensions.height} px
              <br />
              <strong>Format:</strong> {downloadConfig.format.toUpperCase()}
              {supportedDownloadFormats.find(
                (f) => f.name === downloadConfig.format,
              )?.quality && <span> • Quality: {downloadConfig.quality}%</span>}
            </div>
          </div>
          <div className="max-h-[60vh] min-h-full overflow-y-auto pr-4">
            <div className="flex w-full flex-col gap-4 pb-8">
              <div>
                <label htmlFor="fileformat">File format</label>

                <Select
                  value={downloadConfig.format}
                  onValueChange={(value) =>
                    setDownloadConfig({
                      ...downloadConfig,
                      format: value as FileFormat,
                    })
                  }
                >
                  <SelectTrigger id="fileformat" className="mt-4 w-full">
                    <SelectValue aria-label={downloadConfig.format}>
                      {downloadConfig.format.toUpperCase()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {supportedDownloadFormats.map((format) => (
                      <SelectItem key={format.name} value={format.name}>
                        <div className="flex flex-col">
                          <span>{format.name.toUpperCase()}</span>
                          <small className="text-gray-500">
                            {format.transparency
                              ? "Supports transparency"
                              : "No transparency"}
                          </small>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {supportedDownloadFormats.find(
                (f) => f.name === downloadConfig.format,
              )?.quality && (
                <div>
                  <label
                    htmlFor="quality"
                    className="mb-2 block text-sm font-medium"
                  >
                    Quality: {downloadConfig.quality}%
                  </label>
                  <Input
                    id="quality"
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={downloadConfig.quality}
                    onChange={(e) => {
                      setDownloadConfig({
                        ...downloadConfig,
                        quality: parseInt(e.target.value),
                      });
                    }}
                    className="w-full"
                  />
                </div>
              )}
              <div>
                <label htmlFor="filename">Filename</label>
                <div className="relative mt-4 inline-flex w-full items-center">
                  <Input
                    id="filename"
                    value={downloadConfig.filename}
                    type="text"
                    inputMode="text"
                    onChange={(e) => updateFilename(e.target.value)}
                    className="w-full pr-14"
                    placeholder="gradie-gradient"
                  />
                  <small className="absolute right-4 font-light">
                    {255 - downloadConfig.filename.length}
                  </small>
                </div>
              </div>
              <div>
                <label htmlFor="dimensionMode">Dimension Mode</label>

                <Select
                  value={downloadConfig.dimensionMode}
                  onValueChange={handleDimensionModeChange}
                >
                  <SelectTrigger id="dimensionMode" className="mt-4 w-full">
                    <SelectValue aria-label={downloadConfig.dimensionMode}>
                      {downloadConfig.dimensionMode}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {dimensionModes.map((mode) => (
                      <SelectItem key={mode.name} value={mode.name}>
                        <div className="flex flex-col py-1">
                          <span className="font-medium">{mode.name}</span>
                          <small className="text-gray-500">
                            {mode.definition}
                          </small>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {downloadConfig.dimensionMode === "custom" && (
                <div className="grid w-full grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customWidth">Width</label>
                    <Input
                      className="mt-4"
                      id="customWidth"
                      type="number"
                      min={16}
                      max={5000}
                      placeholder="Width in pixels"
                      inputMode="numeric"
                      value={downloadConfig.width}
                      onChange={(e) => {
                        setDownloadConfig({
                          ...downloadConfig,
                          width: parseInt(e.target.value) || 0,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="customHeight">Height</label>
                    <Input
                      className="mt-4"
                      id="customHeight"
                      type="number"
                      min={16}
                      max={5000}
                      placeholder="Height in pixels"
                      inputMode="numeric"
                      value={downloadConfig.height}
                      onChange={(e) => {
                        setDownloadConfig({
                          ...downloadConfig,
                          height: parseInt(e.target.value) || 0,
                        });
                      }}
                    />
                  </div>
                </div>
              )}
              {downloadConfig.dimensionMode === "preset" && (
                <div>
                  <label htmlFor="preset">Preset</label>

                  <Select
                    value={downloadConfig.preset}
                    onValueChange={handlePresetChange}
                  >
                    <SelectTrigger id="preset" className="mt-4 w-full">
                      <SelectValue aria-label={downloadConfig.preset}>
                        {dimensionPresets.find(
                          (p) => p.key === downloadConfig.preset,
                        )?.label ?? downloadConfig.preset}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {dimensionPresets.map((preset) => (
                        <SelectItem key={preset.key} value={preset.key}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{preset.label}</span>
                            <small className="text-gray-500">
                              {preset.useCases.join(", ")}
                            </small>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {downloadConfig.dimensionMode === "aspect-ratio" && (
                <>
                  <div>
                    <label
                      htmlFor="aspectRatio"
                      className="mb-2 block text-sm font-medium"
                    >
                      Aspect Ratio
                    </label>
                    <Select
                      value={downloadConfig.aspectRatio || "landscape"}
                      onValueChange={handleAspectRatioChange}
                    >
                      <SelectTrigger id="aspectRatio" className="w-full">
                        <SelectValue>
                          {
                            downloadAspectRatios[
                              downloadConfig.aspectRatio || "landscape"
                            ].label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(downloadAspectRatios).map(
                          ([key, ratio]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex flex-col py-1">
                                <span className="font-medium">
                                  {ratio.label}
                                </span>
                                <small className="text-gray-500">
                                  Ratio: {ratio.ratio.toFixed(3)}
                                </small>
                              </div>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="aspectWidth"
                        className="mb-2 block text-sm font-medium"
                      >
                        Width <small>(primary)</small>
                      </label>
                      <Input
                        id="aspectWidth"
                        type="number"
                        min={16}
                        max={5000}
                        placeholder="Width in pixels"
                        value={downloadConfig.width}
                        onChange={(e) => {
                          handleAspectRatioDimensionChange(
                            "width",
                            parseInt(e.target.value) || 0,
                          );
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="aspectHeight"
                        className="mb-2 block text-sm font-medium"
                      >
                        Height <small>(or primary)</small>
                      </label>
                      <Input
                        id="aspectHeight"
                        type="number"
                        min={16}
                        max={5000}
                        placeholder="Height in pixels"
                        value={downloadConfig.height}
                        onChange={(e) => {
                          handleAspectRatioDimensionChange(
                            "height",
                            parseInt(e.target.value) || 0,
                          );
                        }}
                      />
                    </div>
                  </div>
                  <small className="text-gray-500">
                    Set either width or height - the other will be calculated
                    automatically based on the aspect ratio.
                  </small>
                </>
              )}
            </div>
          </div>
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
