import type { FileFormat } from "@/types";

interface DownloadFormatConfig {
  name: FileFormat;
  ext: string;
  mime: string;
  quality: boolean;
  transparency: boolean;
}

const supportedDownloadFormats: Readonly<DownloadFormatConfig[]> = [
  // Raster formats
  {
    name: "webp",
    ext: "webp",
    mime: "image/webp",
    quality: true,
    transparency: true,
  },
  {
    name: "png",
    ext: "png",
    mime: "image/png",
    quality: false,
    transparency: true,
  },
  {
    name: "jpeg",
    ext: "jpeg",
    mime: "image/jpeg",
    quality: true,
    transparency: false,
  },

  // Vector formats (we can generate these!)
  {
    name: "svg",
    ext: "svg",
    mime: "image/svg+xml",
    quality: false,
    transparency: true,
  },
];

export default supportedDownloadFormats;
