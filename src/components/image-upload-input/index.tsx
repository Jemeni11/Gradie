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
import useColorThief from "use-color-thief";
import { imageAtom, paletteAtom, convertedPaletteAtom } from "@/store";
import { cn } from "@/lib/utils";
import { generateUUID, copyToClipboard } from "@/utils";
import { ValidatedFile } from "@/types";
import { ImageIcon, DocumentIcon, DeleteIcon, InfoIcon } from "@/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [filesWithError, filesWithoutError] = useMemo(() => {
    const a: ValidatedFile[] = [],
      b: ValidatedFile[] = [];

    images.forEach((f) => f?.status && (f.status.length ? a : b).push(f));

    return [a, b];
  }, [images]);

  // Auto-remove error files after timeout
  useEffect(() => {
    const interval = setInterval(() => {
      if (filesWithError && filesWithError?.length > 0) {
        setImages((prev) => {
          const firstErrorIndex = prev.findIndex(
            (file) => file?.status && file.status.length !== 0,
          );
          if (firstErrorIndex !== -1) {
            return [
              ...prev.slice(0, firstErrorIndex),
              ...prev.slice(firstErrorIndex + 1),
            ];
          }
          return prev;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [images, filesWithError, setImages]);

  const validateFile = useCallback((file: File) => {
    if (!file) return ["Invalid file"];

    const errors = [];
    if (!file.type.startsWith("image/")) {
      errors.push(`File ${file.name} is not an image`);
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

      // Simply replace any existing files with our new file
      // This ensures we only ever have one valid file
      setImages((prevFiles) => {
        // Keep only the error files, and add our new file
        const errorFiles = prevFiles.filter((file) => file.status.length > 0);
        return [...errorFiles, newFile];
      });

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

      const clipboardItems = event.clipboardData?.items;
      if (!clipboardItems) return;

      // Count image items in clipboard
      let imageCount = 0;
      for (let i = 0; i < clipboardItems.length; i++) {
        if (clipboardItems[i].type.startsWith("image/")) {
          imageCount++;
        }
      }

      if (imageCount === 0) {
        toast.error("No image found in clipboard.");
      }

      // Look for images in clipboard items
      for (let i = 0; i < clipboardItems.length; i++) {
        if (clipboardItems[i].type.startsWith("image/")) {
          const blob = clipboardItems[i].getAsFile();
          if (blob) {
            // Create a File from Blob with a proper name
            const file = new File(
              [blob],
              `pasted-image-${new Date().toISOString().replace(/:/g, "-")}.png`,
              { type: blob.type },
            );
            addFiles([file]);

            // Show message if multiple images were found but only one used
            if (imageCount > 1) {
              toast.info("Multiple images found. Only using the first one.");
            }
            break; // Only handle the first image
          }
        }
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

  const imageFile = filesWithoutError[0]?.file ?? null;

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

  const { palette } = useColorThief(imgSrc ?? "", {
    format: "hex",
    colorCount: 5,
    quality: 5,
  });

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
    setImages([]);
    setPalette([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setImages, setPalette]);

  return (
    <div className={cn("grid", className)} {...rest}>
      {filesWithoutError.length === 0 ? (
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
                      <span>, </span>
                      <span
                        className="cursor-pointer text-[#1388f2]"
                        tabIndex={0}
                        role="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        camera
                      </span>
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
                  capture="environment"
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
              alt={filesWithoutError[0].file.name}
              className="mx-auto h-full rounded-lg"
            />
          </div>
          {filesWithoutError.length > 0 && (
            <div
              key={filesWithoutError[0].key}
              className={cn(
                "my-4 flex w-full items-center justify-between rounded-lg border border-solid border-[#cfd2d5] bg-white px-4.5 py-3.5",
                successAnimation && "animate-pulse border-green-500",
              )}
            >
              <div className="flex">
                <DocumentIcon className="mr-3.5 min-w-5" aria-hidden="true" />
                <p
                  className="font-semibold"
                  title={filesWithoutError[0].file.name}
                >
                  {filesWithoutError[0].file.name.length > 40
                    ? filesWithoutError[0].file.name.substring(0, 35) + "..."
                    : filesWithoutError[0].file.name}
                </p>
              </div>
              <button
                onClick={handleDeleteClick}
                aria-label="Remove uploaded image"
                className="rounded-full p-2 hover:cursor-pointer"
              >
                <DeleteIcon aria-hidden="true" />
              </button>
            </div>
          )}
          {renderedPalette && (
            <>
              <div className="flex w-full justify-between gap-x-8 rounded-lg">
                {renderedPalette?.map((paletteColor) => (
                  <button
                    type="button"
                    key={`${paletteColor}`}
                    className="flex cursor-pointer flex-col items-center"
                    onClick={() =>
                      copyToClipboard(
                        `${paletteColor}`.toLocaleUpperCase(),
                        "Color copied!",
                      )
                    }
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
                <AlertDescription>
                  Click any color to copy its value
                </AlertDescription>
              </Alert>
            </>
          )}
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
