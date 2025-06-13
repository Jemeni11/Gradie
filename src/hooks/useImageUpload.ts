// hooks/useImageUpload.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { RESET } from "jotai/utils";
import { generateUUID } from "@/utils";
import { ValidatedFile } from "@/types";
import { useSetAtom, useAtom } from "jotai";
import {
  imageAtom,
  paletteAtom,
  customPickStartAtom,
  customPickEndAtom,
  customPickStopAtom,
  gradieModeAtom,
  gradientAngleAtom,
  gradientPositionAtom,
  gradientTypeAtom,
  radialShapeAtom,
  originalImageSizeAtom,
} from "@/store";

export function useImageUpload(onDrop?: (files: File[]) => void) {
  const [images, setImages] = useAtom(imageAtom);
  const setPalette = useSetAtom(paletteAtom);
  const setCustomPickStart = useSetAtom(customPickStartAtom);
  const setCustomPickEnd = useSetAtom(customPickEndAtom);
  const setCustomPickStop = useSetAtom(customPickStopAtom);
  const setGradieMode = useSetAtom(gradieModeAtom);
  const setGradientAngle = useSetAtom(gradientAngleAtom);
  const setGradientPosition = useSetAtom(gradientPositionAtom);
  const setGradientType = useSetAtom(gradientTypeAtom);
  const setRadialShape = useSetAtom(radialShapeAtom);
  const setOriginalImageSize = useSetAtom(originalImageSizeAtom);

  const [dragIsOver, setDragIsOver] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const dropAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPasteTimeRef = useRef<number>(0);
  const pasteDebounceTimeMs = 300;

  const { filesWithError, validFile } = useMemo(() => {
    const errors: ValidatedFile[] = [];
    const valid = images.find((f) => f?.status?.length === 0);
    images.forEach((f) => {
      if (f?.status?.length > 0) errors.push(f);
    });
    return { filesWithError: errors, validFile: valid };
  }, [images]);

  useEffect(() => {
    if (filesWithError.length > 0) {
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

      if (newFile.status.length === 0) {
        setSuccessAnimation(true);
        setTimeout(() => setSuccessAnimation(false), 1500);
        onDrop?.([newFile.file]);
      }
    },
    [validateFile, onDrop, setImages],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const now = Date.now();
      if (now - lastPasteTimeRef.current < pasteDebounceTimeMs) return;
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
        const file = new File(
          [imageFile],
          `pasted-image-${new Date().toISOString().replace(/:/g, "-")}.png`,
          { type: imageFile.type },
        );
        addFiles([file]);
      } else {
        toast.error("Invalid image!");
      }
    },
    [addFiles],
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragIsOver(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
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
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragIsOver(false);

      let droppedFiles = Array.from(event.dataTransfer.files);
      droppedFiles = droppedFiles.filter((file) =>
        file.type.startsWith("image/"),
      );

      if (droppedFiles.length > 0) {
        addFiles([droppedFiles[0]]);
      } else {
        toast.warning("No valid images found in dropped files.");
      }
    },
    [addFiles],
  );

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
    setOriginalImageSize(RESET);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [
    setImages,
    setPalette,
    setCustomPickStart,
    setCustomPickEnd,
    setCustomPickStop,
    setGradieMode,
    setGradientAngle,
    setGradientPosition,
    setGradientType,
    setRadialShape,
    setOriginalImageSize,
  ]);

  return {
    dragIsOver,
    successAnimation,
    dropAreaRef,
    fileInputRef,
    filesWithError,
    validFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDeleteClick,
    addFiles,
  };
}
