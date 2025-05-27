import { useState, useEffect, RefObject, useCallback } from "react";
import ColorThief from "colorthief";
import type { ColorFormat } from "@/types";
import { colorConverter } from "@/utils";

export type ColorThiefColor = string | null;

export interface ColorThiefOptions {
  format?: ColorFormat;
  quality?: number;
  colorCount?: number;
}

export interface ColorThiefOutput {
  color: ColorThiefColor;
  palette: Array<ColorThiefColor>;
  loading: boolean;
  error: string | null;
}

export interface ColorThiefError extends Error {
  type: "LOAD_ERROR" | "EXTRACTION_ERROR" | "NETWORK_ERROR";
}

/**
 * Converts 3 rgb integers into a hex string
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number): string => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Safely extracts colors with fallback handling
 */
const safeColorExtraction = (
  img: HTMLImageElement,
  quality: number,
  colorCount: number,
  format: ColorFormat,
): { color: ColorThiefColor; palette: Array<ColorThiefColor> } => {
  const colorThief = new ColorThief();

  // Try to get the dominant color
  let color: ColorThiefColor = null;
  try {
    const rgbColor = colorThief.getColor(img, quality);
    const hexColor = rgbToHex(...rgbColor);
    color = colorConverter(hexColor, format);
  } catch {
    // Fallback: try with different quality or use a default color
    try {
      const rgbColor = colorThief.getColor(img, 1);
      const hexColor = rgbToHex(...rgbColor);
      color = colorConverter(hexColor, format);
    } catch {
      // Ultimate fallback - analyze canvas pixel data manually
      const fallbackColor = extractColorFromCanvas(img);
      color = fallbackColor ? colorConverter(fallbackColor, format) : null;
    }
  }

  // Try to get the palette
  let palette: Array<ColorThiefColor> = [];
  try {
    const rgbPalette = colorThief.getPalette(img, colorCount, quality);
    palette = rgbPalette.map((paletteColor) => {
      const hexColor = rgbToHex(...paletteColor);
      return colorConverter(hexColor, format);
    });
  } catch {
    // Fallback: create palette from single color or try with fewer colors
    if (color) {
      palette = [color];

      // Try to get at least a small palette
      for (let count = Math.min(colorCount, 5); count >= 2; count--) {
        try {
          const rgbPalette = colorThief.getPalette(img, count, 1);
          palette = rgbPalette.map((paletteColor) => {
            const hexColor = rgbToHex(...paletteColor);
            return colorConverter(hexColor, format);
          });
          break;
        } catch {
          continue;
        }
      }
    }
  }

  return { color, palette };
};

/**
 * Manual color extraction from canvas as ultimate fallback
 */
const extractColorFromCanvas = (img: HTMLImageElement): ColorThiefColor => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Sample the center pixel
    const centerX = Math.floor(img.width / 2);
    const centerY = Math.floor(img.height / 2);
    const imageData = ctx.getImageData(centerX, centerY, 1, 1);
    const [r, g, b] = imageData.data;

    return rgbToHex(r, g, b);
  } catch {
    return null;
  }
};

/**
 * Enhanced hook to grab a primary color and a color palette from an image ref, url, or data url
 * with comprehensive error handling and loading states
 */
const useColorThief = (
  source: string | RefObject<HTMLImageElement> | null,
  options: ColorThiefOptions = {},
): ColorThiefOutput => {
  const { format = "hex", quality = 10, colorCount = 10 } = options;

  const [url, setUrl] = useState("");
  const [output, setOutput] = useState<ColorThiefOutput>({
    color: null,
    palette: [],
    loading: false,
    error: null,
  });

  // Reset function to clear state
  const resetState = useCallback(() => {
    setOutput((prev) => ({
      ...prev,
      color: null,
      palette: [],
      loading: false,
      error: null,
    }));
  }, []);

  // Get the url to use for generating a palette
  useEffect(() => {
    if (!source) {
      resetState();
      setUrl("");
      return;
    }

    if (typeof source === "string" && source.length) {
      setUrl(source);
    } else {
      const { current } = source as RefObject<HTMLImageElement>;
      if (
        current &&
        current instanceof HTMLImageElement &&
        current.src !== window.location.href
      ) {
        const setCurrentSrc = () => {
          if (current.src) {
            setUrl(current.src);
          }
        };

        setCurrentSrc();
        const observer = new MutationObserver(setCurrentSrc);
        observer.observe(current, { attributes: true });

        return () => {
          observer.disconnect();
        };
      }
    }
  }, [source, resetState]);

  // When the image url changes, update the color and palette
  useEffect(() => {
    let isCurrent = true;
    let img: HTMLImageElement | null = null;

    if (!url) {
      resetState();
      return;
    }

    // Set loading state
    setOutput((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    const handleImageLoad = () => {
      if (!isCurrent) return;

      try {
        const { color, palette } = safeColorExtraction(
          img!,
          quality,
          colorCount,
          format,
        );

        setOutput({
          color,
          palette,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (isCurrent) {
          setOutput((prev) => ({
            ...prev,
            loading: false,
            error: `Failed to extract colors: ${err instanceof Error ? err.message : "Unknown error"}`,
          }));
        }
      }
    };

    const handleImageError = () => {
      if (!isCurrent) return;

      const errorMsg = img?.src.startsWith("data:")
        ? "Failed to load data URL image"
        : `Failed to load image from ${url}`;

      setOutput((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }));
    };

    const handleImageAbort = () => {
      if (!isCurrent) return;

      setOutput((prev) => ({
        ...prev,
        loading: false,
        error: "Image loading was aborted",
      }));
    };

    img.addEventListener("load", handleImageLoad);
    img.addEventListener("error", handleImageError);
    img.addEventListener("abort", handleImageAbort);

    // Set source last to trigger loading
    img.src = url;

    return () => {
      isCurrent = false;
      if (img) {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageError);
        img.removeEventListener("abort", handleImageAbort);
        // Don't set src to empty string as it might trigger unwanted requests
        img = null;
      }
    };
  }, [url, colorCount, quality, resetState, format]);

  return output;
};

export default useColorThief;
