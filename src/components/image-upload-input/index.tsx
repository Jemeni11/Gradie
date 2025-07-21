import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useAtomValue, useSetAtom } from "jotai";
import useColorThief from "@/hooks/useColorThief";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
  paletteAtom,
  convertedPaletteAtom,
  loadingStateAtom,
  originalImageSizeAtom,
  downloadConfigAtom,
} from "@/store";
import { cn } from "@/lib/utils";
import PaletteContainer from "./palette-container";
import ImageInfo from "./image-info";
import { usePostHog } from "posthog-js/react";

/**
 * The ImageUploadInput component provides a user interface for image uploads.
 * It supports drag-and-drop, file selection through a file input, and clipboard paste.
 * The component is specifically designed for single image uploads for a gradient generator.
 */
export default function ImageUploadInput({
  onDrop,
  className,
  ...rest
}: Readonly<{
  onDrop?: (files: File[]) => void;
  className?: string;
}>) {
  const posthog = usePostHog();

  const { successAnimation, filesWithError, validFile, handleDeleteClick } =
    useImageUpload(onDrop);

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageFile = validFile?.file ?? null;
  const setDownloadConfig = useSetAtom(downloadConfigAtom);
  const setOriginalImageSize = useSetAtom(originalImageSizeAtom);
  const setLoadingState = useSetAtom(loadingStateAtom);

  const { palette, error, loading } = useColorThief(imgSrc ?? "", {
    format: "hex",
    colorCount: 5,
    quality: 5,
  });

  useEffect(() => {
    if (loading !== undefined) {
      setLoadingState(loading);
    }
  }, [loading, setLoadingState]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }

    // Handle "invalid" image if palette is too short
    if (
      !loading &&
      !error &&
      Array.isArray(palette) &&
      palette.length == 1 &&
      imageFile
    ) {
      toast.error("Image appears to be too plain to generate a palette.");
      posthog?.capture("image_rejected", {
        reason: "Image appears to be too plain to generate a palette.",
      });
      handleDeleteClick();
    }
  }, [error, loading, palette, posthog, handleDeleteClick, imageFile]);

  useEffect(() => {
    if (!imgSrc || !imageRef.current) return;

    const img = imageRef.current;

    const updateDimensions = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      setDownloadConfig((prev) => ({ ...prev, width, height }));
      setOriginalImageSize({ width, height });
    };

    if (img.complete && img.naturalWidth !== 0) {
      updateDimensions();
    } else {
      img.addEventListener("load", updateDimensions);
      return () => img.removeEventListener("load", updateDimensions);
    }
  }, [imgSrc, setDownloadConfig, setOriginalImageSize]);

  useEffect(() => {
    if (!imageFile) {
      setImgSrc("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const setPalette = useSetAtom(paletteAtom);
  useEffect(() => {
    if (Array.isArray(palette)) {
      setPalette(palette as string[]);
      posthog?.capture("palette_generated", {
        palette_size: palette.length,
      });
    }
  }, [palette, setPalette, posthog]);

  const convertedPalette = useAtomValue(convertedPaletteAtom);
  const renderedPalette = convertedPalette ?? palette;

  return (
    <div className={cn("grid", className)} {...rest}>
      <div className="p-8">
        <div className="aspect-video w-full rounded-lg">
          <img
            ref={imageRef}
            src={imgSrc === "" ? undefined : imgSrc}
            alt={validFile?.file.name}
            className="mx-auto h-full rounded-lg"
          />
        </div>
        {validFile && (
          <ImageInfo
            file={validFile}
            deleteHandler={handleDeleteClick}
            success={successAnimation}
          />
        )}
        {renderedPalette && <PaletteContainer palette={renderedPalette} />}
      </div>

      <div className="flex flex-col gap-2">
        {filesWithError?.map((file) => (
          <p key={file.key} className="mb-2 text-sm text-red-700" role="alert">
            {file.status.map((status) => status + "\n")}
          </p>
        ))}
      </div>
    </div>
  );
}
