import { SVGProps } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Banner({
  onEnable,
  onDismiss,
}: {
  onEnable: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="border-border bg-muted text-muted-foreground relative isolate border px-4 py-3 text-sm shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 md:px-8">
        <p className="w-full text-center md:w-auto">
          Gradie can collect anonymous usage data to help improve the app. It's
          off by default.{" "}
          <Dialog>
            <DialogTrigger asChild>
              <span className="hover:text-foreground cursor-pointer font-medium underline underline-offset-4">
                Learn more
              </span>
            </DialogTrigger>
            <DialogContent className="h-full max-h-[80%] max-w-xl overflow-y-scroll md:max-h-auto md:min-h-[95%] md:overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Analytics & Privacy</DialogTitle>
                <DialogDescription>
                  TL;DR? I don't want your data.
                </DialogDescription>
              </DialogHeader>
              <div className="text-muted-foreground flex w-full flex-col gap-4 text-sm leading-relaxed">
                <p>
                  Gradie does everything on your device. Image analysis, palette
                  generation, gradient rendering, and downloads are all fully
                  local. You can literally turn off your Wi-Fi after the page
                  loads and it'll still work just fine.
                </p>

                <hr className="border-muted my-1" />

                <p className="text-foreground text-base font-medium">
                  So what
                  <span className="italic"> is </span>
                  tracked?
                </p>
                <div className="space-y-2">
                  <p>
                    I log a few anonymous events to understand how Gradie's used
                    and what to improve. No personal info. Just stuff like:
                  </p>
                  <ul className="custom-marker-list space-y-1">
                    <li>How you added an image (drag, paste, or upload)</li>
                    <li>
                      What type/size the image was (not the image itself!)
                    </li>
                    <li>Whether it worked or failed to load</li>
                    <li>What format you downloaded in (PNG, SVG, etc)</li>
                    <li>Whether you enabled enhanced gradient mode</li>
                  </ul>
                  <p>
                    That's it. I don't know who you are, and I don't want to.
                    You're not the droid I'm looking for.{" "}
                    <span className="wave-pulse">👋</span>
                  </p>
                </div>

                <div>
                  Curious? Check out{" "}
                  <a
                    href="https://github.com/Jemeni11/Gradie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium underline underline-offset-4"
                  >
                    the source code on GitHub
                  </a>{" "}
                  to see exactly what's tracked.
                </div>
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    type="button"
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
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
