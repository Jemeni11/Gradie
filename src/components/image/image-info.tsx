import type { ValidatedFile } from "@/types";
import { DocumentIcon, DeleteIcon } from "@/icons";
import { cn } from "@/lib/utils";

export default function ImageInfo({
  file,
  deleteHandler,
  success,
}: {
  file: ValidatedFile;
  deleteHandler: () => void;
  success: boolean;
}) {
  return (
    <div
      key={file.key}
      className={cn(
        "my-4 flex w-full items-center justify-between rounded-lg border border-solid border-[#cfd2d5] bg-white px-4.5 py-3.5",
        success && "animate-pulse border-green-500",
      )}
    >
      <div className="flex">
        <DocumentIcon className="mr-3.5 min-w-5" aria-hidden="true" />
        <p className="font-semibold" title={file.file.name}>
          {file.file.name.length > 40
            ? file.file.name.substring(0, 35) + "..."
            : file.file.name}
        </p>
      </div>
      <button
        onClick={deleteHandler}
        aria-label="Remove uploaded image"
        className="rounded-full p-2 hover:cursor-pointer"
      >
        <DeleteIcon aria-hidden="true" />
      </button>
    </div>
  );
}
