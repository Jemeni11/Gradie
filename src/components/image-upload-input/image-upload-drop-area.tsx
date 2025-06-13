import React from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "@/icons";

type Props = {
  dragIsOver: boolean;
  dropAreaRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  addFiles: (files: File[], uploadMethod: "drag" | "paste" | "file") => void;
  successAnimation: boolean;
  onDragOver?: () => void;
};

export default function ImageUploadDropArea({
  dragIsOver,
  dropAreaRef,
  fileInputRef,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  addFiles,
  successAnimation,
  onDragOver,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleFocus = () => {
    dropAreaRef.current?.classList.add("ring-2", "ring-blue-400");
  };

  const handleBlur = () => {
    dropAreaRef.current?.classList.remove("ring-2", "ring-blue-400");
  };

  return (
    <div
      ref={dropAreaRef}
      className={cn(
        "border-gradie-2 relative flex flex-col items-center gap-4 rounded-lg border-2 border-dashed py-4",
        dragIsOver ? "bg-gradie-2" : "bg-transparent",
      )}
      onDragOver={(e) => {
        handleDragOver(e);
        onDragOver?.();
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      tabIndex={0}
      role="button"
      aria-label="Upload image area. Press Enter to open file browser"
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
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
            <div className="flex flex-wrap items-center justify-center gap-1">
              <span>Upload via drag,</span>
              <label
                htmlFor="ImageUpload"
                role="button"
                className="cursor-pointer text-[#1388f2]"
                tabIndex={0}
                onKeyDown={handleKeyDown}
              >
                file select
              </label>
              <span>, or paste.</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            id="ImageUpload"
            name="ImageUpload"
            accept="image/*"
            className="h-0 w-0 opacity-0"
            onChange={(e) => addFiles(Array.from(e.target.files ?? []), "file")}
            aria-label="Upload image"
          />
        </div>
      </div>
    </div>
  );
}
