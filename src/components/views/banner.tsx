import { SVGProps } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AnalyticsDialogContent from "./analytics-dialog-content";

export default function Banner({
  onEnable,
  onDismiss,
}: {
  onEnable: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="border-border bg-muted text-muted-foreground relative isolate border py-3 text-sm shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col flex-wrap items-center justify-between gap-4 px-4 py-2 md:flex-row md:gap-2 md:px-8 md:py-0">
        <p className="w-full text-center md:w-auto">
          Gradie can collect anonymous usage data to help improve the app. It's
          off by default.{" "}
          <Dialog>
            <DialogTrigger asChild>
              <span className="hover:text-foreground cursor-pointer font-medium underline underline-offset-4">
                Learn more
              </span>
            </DialogTrigger>
            <AnalyticsDialogContent />
          </Dialog>
        </p>

        <div className="flex items-center gap-2">
          <Button
            onClick={onEnable}
            aria-label="Enable anonymous analytics"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition-colors"
          >
            Enable
          </Button>

          <Button
            onClick={onDismiss}
            variant="outline"
            aria-label="Dismiss banner"
            className="border-border bg-background hover:bg-muted inline-flex cursor-pointer items-center justify-center rounded-md border p-1.5"
          >
            <Close />
          </Button>
        </div>
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
