import { useAtomValue, useAtom } from "jotai";
import { useMemo, useRef, useState, useCallback } from "react";
import { domToJpeg, domToPng, domToSvg, domToWebp } from "modern-screenshot";
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
import { capitalizeFirstLetter } from "@/utils";
import GradientPreview from "./gradient-preview";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";

export default function DownloadDialog() {
  const posthog = usePostHog();

  const gradientString = useAtomValue(gradientStringAtom);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [downloadConfig, setDownloadConfig] = useAtom(downloadConfigAtom);
  const originalImageSize = useAtomValue(originalImageSizeAtom);
  const { height: browserHeight, width: browserWidth } = useWindowSize();

  // Helper to calculate dimensions based on aspect ratio
  const calculateAspectRatioDimensions = useCallback(
    (aspectRatio: AspectRatio, width: number, height: number) => {
      const ratio = downloadAspectRatios[aspectRatio].ratio;

      // Use whichever dimension is set (non-zero) to calculate the other
      if (width > 0 && height <= 0) {
        return { width, height: Math.round(width / ratio) };
      } else if (height > 0 && width <= 0) {
        return { width: Math.round(height * ratio), height };
      } else if (width > 0 && height > 0) {
        // Both are set, use width as primary and calculate height
        return { width, height: Math.round(width / ratio) };
      }

      // Neither dimension is set, use default
      return { width: 1920, height: Math.round(1920 / ratio) };
    },
    [],
  );

  const exportDimensions = useMemo(() => {
    const preset = dimensionPresets.find(
      (p) => p.key === downloadConfig.preset,
    );

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
        return downloadConfig.aspectRatio
          ? calculateAspectRatioDimensions(
              downloadConfig.aspectRatio,
              downloadConfig.width,
              downloadConfig.height,
            )
          : { width: downloadConfig.width, height: downloadConfig.height };
      case "custom":
      default:
        return { width: downloadConfig.width, height: downloadConfig.height };
    }
  }, [
    downloadConfig,
    browserWidth,
    browserHeight,
    originalImageSize,
    calculateAspectRatioDimensions,
  ]);

  // Generic config updater
  const updateConfig = useCallback(
    (updates: Partial<DownloadConfig>) => {
      setDownloadConfig((prev) => ({ ...prev, ...updates }));
    },
    [setDownloadConfig],
  );

  // Export functions map
  const exportFunctions = useMemo(
    () => ({
      png: domToPng,
      webp: domToWebp,
      jpeg: domToJpeg,
      svg: domToSvg,
    }),
    [],
  );

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

      const exportFn =
        exportFunctions[downloadConfig.format as keyof typeof exportFunctions];
      if (!exportFn) {
        throw new Error(`Unsupported format: ${downloadConfig.format}`);
      }

      const dataUrl = await exportFn(previewRef.current, exportOptions);

      // Create and trigger download
      const link = document.createElement("a");
      const filename = downloadConfig.filename || "gradie-gradient";
      link.download = `${filename}.${fileFormatConfig.ext}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download completed!");

      posthog?.capture("download_successful", {
        format: fileFormatConfig?.name,
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(
        `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      posthog?.capture("download_failed", {
        reason: `${error instanceof Error ? error.message : error}`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDimensionModeChange = useCallback(
    (newMode: DimensionMode) => {
      const updates: Partial<DownloadConfig> = { dimensionMode: newMode };
      const preset = dimensionPresets.find(
        (p) => p.key === downloadConfig.preset,
      );

      switch (newMode) {
        case "viewport":
          Object.assign(updates, {
            width: browserWidth,
            height: browserHeight,
          });
          break;
        case "original":
          Object.assign(updates, {
            width: originalImageSize.width || 1200,
            height: originalImageSize.height || 800,
          });
          break;
        case "preset":
          if (preset) {
            Object.assign(updates, {
              width: preset.width,
              height: preset.height,
            });
          }
          break;
        case "aspect-ratio":
          if (!downloadConfig.aspectRatio) {
            updates.aspectRatio = "landscape";
          }
          if (downloadConfig.width <= 0 && downloadConfig.height <= 0) {
            Object.assign(updates, { width: 1920, height: 0 });
          }
          break;
      }

      updateConfig(updates);
    },
    [
      downloadConfig,
      browserWidth,
      browserHeight,
      originalImageSize,
      updateConfig,
    ],
  );

  const handlePresetChange = useCallback(
    (presetKey: DimensionPreset) => {
      const preset = dimensionPresets.find((p) => p.key === presetKey);
      if (preset) {
        updateConfig({
          preset: presetKey,
          width: preset.width,
          height: preset.height,
        });
        posthog?.capture("preset_selected", {
          name: preset.label,
          category: preset.category,
        });
      }
    },
    [updateConfig, posthog],
  );

  const updateFilename = useCallback(
    (newFilename: string) => {
      const sanitized = newFilename
        .replace(/[<>:"/\\|?*]/g, "")
        .substring(0, 255);
      updateConfig({ filename: sanitized });
    },
    [updateConfig],
  );

  const handleAspectRatioChange = useCallback(
    (newRatio: AspectRatio) => {
      const dimensions = calculateAspectRatioDimensions(
        newRatio,
        downloadConfig.width,
        downloadConfig.height,
      );

      updateConfig({
        aspectRatio: newRatio,
        ...dimensions,
      });
    },
    [
      downloadConfig.width,
      downloadConfig.height,
      calculateAspectRatioDimensions,
      updateConfig,
    ],
  );

  const handleAspectRatioDimensionChange = useCallback(
    (field: "width" | "height", value: number) => {
      if (!downloadConfig.aspectRatio) {
        updateConfig({ [field]: value });
        return;
      }

      const ratio = downloadAspectRatios[downloadConfig.aspectRatio].ratio;
      const dimensions =
        field === "width"
          ? { width: value, height: Math.round(value / ratio) }
          : { width: Math.round(value * ratio), height: value };

      updateConfig(dimensions);
    },
    [downloadConfig.aspectRatio, updateConfig],
  );

  // Get current file format config
  const currentFileFormat = useMemo(
    () =>
      supportedDownloadFormats.find((f) => f.name === downloadConfig.format),
    [downloadConfig.format],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="border-gradie-2 bg-gradie-2 flex-1 cursor-pointer rounded-lg border border-solid px-4 py-2 font-bold text-white"
          type="button"
        >
          <span>Download</span>
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
              {currentFileFormat?.quality && (
                <span> • Quality: {downloadConfig.quality}%</span>
              )}
            </div>
          </div>
          <div className="max-h-[60vh] min-h-full overflow-y-auto pr-4">
            <div className="flex w-full flex-col gap-4 pb-8">
              {/* File Format Selection */}
              <div>
                <label htmlFor="fileformat">File format</label>
                <Select
                  value={downloadConfig.format}
                  onValueChange={(value: FileFormat) =>
                    updateConfig({ format: value })
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

              {/* Quality Slider */}
              {currentFileFormat?.quality && (
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
                    onChange={(e) =>
                      updateConfig({ quality: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              )}

              {/* Filename Input */}
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

              {/* Dimension Mode Selection */}
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

              {/* Custom Dimensions */}
              {downloadConfig.dimensionMode === "custom" && (
                <div className="grid w-full grid-cols-2 gap-4">
                  {["width", "height"].map((field) => (
                    <div key={field}>
                      <label htmlFor={`custom${capitalizeFirstLetter(field)}`}>
                        {capitalizeFirstLetter(field)}
                      </label>
                      <Input
                        className="mt-4"
                        id={`custom${capitalizeFirstLetter(field)}`}
                        type="number"
                        min={16}
                        max={5000}
                        placeholder={`${capitalizeFirstLetter(field)} in pixels`}
                        inputMode="numeric"
                        value={
                          downloadConfig[
                            field as keyof Pick<
                              DownloadConfig,
                              "width" | "height"
                            >
                          ]
                        }
                        onChange={(e) =>
                          updateConfig({
                            [field]: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Preset Selection */}
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

              {/* Aspect Ratio Controls */}
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
                    {[
                      {
                        field: "width" as const,
                        label: "Width",
                        subtitle: "(primary)",
                      },
                      {
                        field: "height" as const,
                        label: "Height",
                        subtitle: "",
                      },
                    ].map(({ field, label, subtitle }) => (
                      <div key={field}>
                        <label
                          htmlFor={`aspect${capitalizeFirstLetter(field)}`}
                          className="mb-2 block text-sm font-medium"
                        >
                          {label} <small>{subtitle}</small>
                        </label>
                        <Input
                          id={`aspect${capitalizeFirstLetter(field)}`}
                          type="number"
                          min={16}
                          max={5000}
                          placeholder={`${label} in pixels`}
                          value={downloadConfig[field]}
                          onChange={(e) =>
                            handleAspectRatioDimensionChange(
                              field,
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                    ))}
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
