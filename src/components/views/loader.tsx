import { LoaderIcon } from "@/icons";

export default function Loader() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
      <div className="relative">
        <LoaderIcon />
      </div>
      <div className="text-center">
        <p className="animate-pulse text-lg font-medium">
          Generating palette...
        </p>
        <div className="mt-2 flex justify-center space-x-1">
          <div
            className="bg-gradie-2 h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="bg-gradie-2 h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="bg-gradie-2 h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
