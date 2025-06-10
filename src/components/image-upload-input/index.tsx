import React, {
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { toast } from "sonner";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import useColorThief from "@/hooks/useColorThief";
import {
  imageAtom,
  paletteAtom,
  convertedPaletteAtom,
  customPickStartAtom,
  customPickEndAtom,
  customPickStopAtom,
  gradieModeAtom,
  gradientAngleAtom,
  gradientPositionAtom,
  gradientTypeAtom,
  radialShapeAtom,
  loadingStateAtom,
} from "@/store";
import { cn } from "@/lib/utils";
import { generateUUID } from "@/utils";
import { ValidatedFile } from "@/types";
import { ImageIcon, InfoIcon } from "@/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PaletteContainer from "./palette-container";
import ImageInfo from "./image-info";

/**
 * The ImageUploadInput component provides a user interface for image uploads.
 * It supports drag-and-drop, file selection through a file input, and clipboard paste.
 * The component is specifically designed for single image uploads for a gradient generator.
 */
export default function ImageUploadInput({
  onDrop,
  onDragOver,
  className,
  ...rest
}: Readonly<{
  onDrop?: (files: File[]) => void;
  onDragOver?: () => void;
  className?: string;
}>) {
  const [images, setImages] = useAtom(imageAtom);

  const [dragIsOver, setDragIsOver] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPasteTimeRef = useRef<number>(0);
  const pasteDebounceTimeMs = 300; // Debounce time in milliseconds

  // Separate files with and without errors
  const { filesWithError, validFile } = useMemo(() => {
    const errors: ValidatedFile[] = [];
    const valid = images.find((f) => f?.status?.length === 0);

    images.forEach((f) => {
      if (f?.status?.length > 0) errors.push(f);
    });

    return { filesWithError: errors, validFile: valid };
  }, [images]);

  // Auto-remove error files after timeout
  useEffect(() => {
    if (filesWithError?.length > 0) {
      const timeout = setTimeout(() => {
        setImages((prev) => prev.filter((file) => file.status.length === 0));
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [filesWithError, setImages]);

  const validateFile = useCallback((file: File) => {
    if (!file) return ["Invalid file"];

    const errors = [];
    if (!file.type.startsWith("image/")) {
      errors.push(`File ${file.name} is not an image`);
    }
    if (file.size === 0) {
      errors.push(`${file.name} appears to be empty`);
    }
    return errors;
  }, []);

  const addFiles = useCallback(
    (filesToAdd: File[]) => {
      // Only take the first file if multiple are provided
      if (filesToAdd.length > 1) {
        toast.info("Only one image allowed. Using the first one.");
      }
      const singleFile = filesToAdd.slice(0, 1);

      if (singleFile.length === 0) return;

      const newFile = {
        file: singleFile[0],
        key: generateUUID(),
        status: validateFile(singleFile[0]),
      };

      setImages([newFile]);

      // If the file is valid, trigger success animation
      if (newFile.status.length === 0) {
        setSuccessAnimation(true);
        setTimeout(() => setSuccessAnimation(false), 1500);

        // Call onDrop callback if provided
        if (onDrop) {
          onDrop([newFile.file]);
        }
      }
    },
    [validateFile, onDrop, setImages],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files! || []);
      addFiles(files);
    },
    [addFiles],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragIsOver(true);
      onDragOver?.();
    },
    [onDragOver],
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Only consider it a leave if we're actually leaving the drop area
    // and not just entering a child element
    const rect = dropAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = event;
      if (
        clientX <= rect.left ||
        clientX >= rect.right ||
        clientY <= rect.top ||
        clientY >= rect.bottom
      ) {
        setDragIsOver(false);
      }
    }
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragIsOver(false);

      let droppedFiles = Array.from(event.dataTransfer.files);
      droppedFiles = droppedFiles.filter((file) =>
        file.type.startsWith("image/"),
      );

      if (droppedFiles.length > 0) {
        if (droppedFiles.length > 1) {
          toast.info("Only one image allowed. Using the first one.");
        }
        addFiles([droppedFiles[0]]);
      } else {
        toast.warning("No valid images found in dropped files.");
      }
    },
    [addFiles],
  );

  // Handle clipboard paste with debounce
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const now = Date.now();

      // Debounce paste events
      if (now - lastPasteTimeRef.current < pasteDebounceTimeMs) {
        return;
      }
      lastPasteTimeRef.current = now;

      const clipboard = Array.from(event.clipboardData?.items || []);
      const images = clipboard.filter((item) => item.type.startsWith("image/"));

      if (images.length === 0) {
        toast.error("No image found in clipboard.");
        return;
      }

      if (images.length > 1) {
        toast.info("Multiple images found. Only using the first one.");
      }

      const imageFile = images[0].getAsFile();

      if (imageFile) {
        // Create a File with a proper name
        const file = new File(
          [imageFile],
          `pasted-image-${new Date().toISOString().replace(/:/g, "-")}.png`,
          { type: imageFile.type },
        );

        addFiles([file]);
      } else {
        toast.error("Invalid image!");
      }
    };

    // Always listen for paste events regardless of current file state
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [addFiles]);

  // Success toast
  useEffect(() => {
    if (successAnimation) {
      toast.success("Image has been uploaded.");
    }
  }, [successAnimation]);

  // Keyboard navigation handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }, []);

  // Support for focus management
  const handleDropAreaFocus = useCallback(() => {
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("ring-2", "ring-blue-400");
    }
  }, []);

  const handleDropAreaBlur = useCallback(() => {
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("ring-2", "ring-blue-400");
    }
  }, []);

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  const imageFile = validFile?.file ?? null;

  useEffect(() => {
    if (!imageFile) {
      setImgSrc("");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImgSrc(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const setLoadingState = useSetAtom(loadingStateAtom);

  const { palette, error, loading } = useColorThief(imgSrc ?? "", {
    format: "hex",
    colorCount: 5,
    quality: 5,
  });

  useEffect(() => {
    setLoadingState(loading);
  }, [loading, setLoadingState]);

  // console.log("\n\n\n\n\n\n\n\n");

  // console.log("1. Loading => \t\t", loading);
  // console.log("2. Palette => \t\t", palette);
  // // console.log("Palette length => \t", palette.length);
  // console.log(
  //   "3. images.length > 0 && (!palette || palette?.length === 0) => \t\t",
  //   images.length > 0 && (!palette || palette?.length === 0),
  // );

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const setCustomPickStart = useSetAtom(customPickStartAtom);
  const setCustomPickEnd = useSetAtom(customPickEndAtom);
  const setCustomPickStop = useSetAtom(customPickStopAtom);
  const setGradieMode = useSetAtom(gradieModeAtom);
  const setGradientAngle = useSetAtom(gradientAngleAtom);
  const setGradientPosition = useSetAtom(gradientPositionAtom);
  const setGradientType = useSetAtom(gradientTypeAtom);
  const setRadialShape = useSetAtom(radialShapeAtom);
  const setPalette = useSetAtom(paletteAtom);

  useEffect(() => {
    if (Array.isArray(palette)) {
      // Adding the format option makes it a string[]
      setPalette(palette as unknown as string[]);
    }
  }, [palette, setPalette]);

  const convertedPalette = useAtomValue(convertedPaletteAtom);

  const renderedPalette =
    convertedPalette && convertedPalette.length > 0
      ? convertedPalette
      : palette;

  // Handle file deletion - removes all files (including valid ones)
  const handleDeleteClick = useCallback(() => {
    setImages(RESET);
    setPalette(RESET);
    setCustomPickStart(RESET);
    setCustomPickEnd(RESET);
    setCustomPickStop(RESET);
    setGradieMode(RESET);
    setGradientAngle(RESET);
    setGradientPosition(RESET);
    setGradientType(RESET);
    setRadialShape(RESET);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [
    setCustomPickEnd,
    setCustomPickStart,
    setCustomPickStop,
    setGradieMode,
    setGradientAngle,
    setGradientPosition,
    setGradientType,
    setImages,
    setPalette,
    setRadialShape,
  ]);

  return (
    <div className={cn("grid", className)} {...rest}>
      {!validFile ? (
        <>
          <div
            ref={dropAreaRef}
            className={cn(
              "border-gradie-2 relative flex flex-col items-center gap-4 rounded-lg border-2 border-dashed py-4",
              dragIsOver ? "bg-gradie-2" : "bg-transparent",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0}
            role="button"
            aria-label="Upload image area. Press Enter to open file browser"
            onKeyDown={handleKeyDown}
            onFocus={handleDropAreaFocus}
            onBlur={handleDropAreaBlur}
          >
            <div className="flex flex-col place-content-center place-items-center items-center gap-4 py-32">
              <ImageIcon
                className={cn([
                  "mb-4 size-10 transition-transform md:mt-0 md:mb-1",
                  !dragIsOver ? "scale-100" : "scale-150 text-white",
                  successAnimation && "animate-bounce text-green-700",
                ])}
                aria-hidden="true"
              />
              <div className="flex flex-col items-center">
                {dragIsOver ? (
                  <span className="z-0 text-white">Drop your image here</span>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      <span>Upload via drag,</span>
                      <label
                        htmlFor="ImageUpload"
                        role="button"
                        className="cursor-pointer text-[#1388f2]"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        file select
                      </label>
                      <span>, or paste.</span>
                    </div>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  id="ImageUpload"
                  name="ImageUpload"
                  accept="image/*"
                  className="h-0 w-0 opacity-0"
                  onChange={handleFileUpload}
                  aria-label="Upload image"
                />
              </div>
            </div>
          </div>
          <Alert className="border-gradie-2 mt-4">
            <InfoIcon className="size-4 animate-pulse motion-reduce:animate-none" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Images only. Only one image will be used.
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <div className="p-8">
          <div className="aspect-video w-full rounded-lg">
            <img
              src={imgSrc === "" ? undefined : imgSrc}
              alt={validFile.file.name}
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
      )}

      <div className="flex flex-col gap-2">
        {images &&
          filesWithError?.map((file) => (
            <p
              key={file.key}
              className="mb-2 text-sm text-red-700"
              role="alert"
            >
              {file.status.map((status) => status + "\n")}
            </p>
          ))}
      </div>
    </div>
  );
}
