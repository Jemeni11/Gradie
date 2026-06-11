import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function AnalyticsDialogContent() {
  return (
    <DialogContent className="md:max-h-auto h-full max-h-[80%] max-w-xl overflow-y-scroll md:min-h-[95%] md:overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Analytics & Privacy</DialogTitle>
        <DialogDescription>TL;DR? I don't want your data.</DialogDescription>
      </DialogHeader>
      <div className="flex w-full flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Gradie does everything on your device. Image analysis, palette generation, gradient rendering, and downloads are all fully local.
          You can literally turn off your Wi-Fi after the page loads and it'll still work just fine.
        </p>

        <hr className="my-1 border-muted" />

        <p className="text-base font-medium text-foreground">
          So what
          <span className="italic"> is </span>
          tracked?
        </p>
        <div className="space-y-2">
          <p>I log a few anonymous events to understand how Gradie's used and what to improve. No personal info. Just stuff like:</p>
          <ul className="custom-marker-list space-y-1">
            <li>How many people visit the site</li>
            <li>When someone generates a gradient (and how many colors it has)</li>
            <li>When someone downloads an image (and the format/dimensions)</li>
            <li>When someone selects a size preset</li>
            <li>Whether a download fails</li>
          </ul>
          <p>That's it. I don't know who you are, and I don't want to.</p>
          <p className="mt-2 text-xs text-muted-foreground/80 italic">
            Note: Before June 10, 2026, I collected a few more details (like image dimensions and upload method) via PostHog. I've since
            removed PostHog and stripped tracking down to just the absolute basics above. If you opted in previously, this new, lighter
            tracking is all that runs now!
          </p>
        </div>

        <div>
          Curious? Check out{" "}
          <a
            href="https://github.com/Jemeni11/Gradie/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            the source code on GitHub
          </a>{" "}
          to see exactly what's tracked.
        </div>
      </div>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="destructive" className="cursor-pointer" type="button">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
