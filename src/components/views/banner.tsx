import { SVGProps } from "react";

export default function Banner({
  onEnable,
  onDismiss,
}: {
  onEnable: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 text-gray-900">
      <p className="w-full text-center font-medium">
        Gradie can collect anonymous usage data to help improve the app but it's
        off by default.{" "}
        <a href="#" className="inline-block underline">
          Learn more
        </a>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Enable anonymous analytics"
          onClick={onEnable}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Enable
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="rounded border border-gray-300 bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-50"
        >
          <Close />
        </button>
      </div>
    </div>
  );
}

function Close(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-5"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
