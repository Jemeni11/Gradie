import { SVGProps } from "react";

export default function Banner({
  onEnable,
  onDismiss,
}: {
  onEnable: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="border-border bg-muted text-muted-foreground relative isolate flex flex-wrap items-center justify-between gap-2 border px-4 py-3 text-sm shadow-sm">
      <p className="w-full text-center md:w-auto">
        Gradie can collect anonymous usage data to help improve the app. It’s
        off by default.{" "}
        <a
          href="#"
          className="hover:text-foreground font-medium underline underline-offset-4"
        >
          Learn more
        </a>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onEnable}
          type="button"
          aria-label="Enable anonymous analytics"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition-colors"
        >
          Enable
        </button>

        <button
          onClick={onDismiss}
          type="button"
          aria-label="Dismiss banner"
          className="border-border bg-background hover:bg-muted inline-flex cursor-pointer items-center justify-center rounded-md border p-1.5"
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
