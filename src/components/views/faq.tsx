import AnalyticsDialogContent from "./analytics-dialog-content";
import { Dialog, DialogTrigger } from "../ui/dialog";
import Code from "./code";
import { LinkIcon } from "@/icons";

export default function FAQ() {
  return (
    <section className="mt-16 mb-8">
      <div className="inline-flex w-full items-center gap-4">
        <img
          src="/logo-spread-out.png"
          className="hidden w-32 sm:block xl:w-3xs"
        />
        <div className="via-gradie-2 sm:from-gradie-2 h-1 w-full rounded-[2px] bg-gradient-to-r from-transparent to-transparent" />
      </div>
      <h2 className="font-aladin mx-auto my-4 w-fit scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        FAQ
      </h2>
      <div className="inline-flex w-full items-center gap-4">
        <div className="via-gradie-2 sm:to-gradie-2 h-1 w-full rounded-[2px] bg-gradient-to-r from-transparent to-transparent" />
        <img
          src="/logo-spread-out.png"
          className="hidden w-32 sm:block xl:w-3xs"
        />
      </div>
      <p className="mx-auto my-8 w-full text-lg leading-7">
        Gradie turned out to be more complicated than I expected. It started as
        a simple idea: Upload an image → extract the dominant colors → generate
        a smooth gradient image. That was it. That's not the case anymore. So
        here's a little FAQ section to explain what's going on.
      </p>

      <div className="space-y-6 text-base leading-relaxed">
        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            What is Gradie?
          </h3>
          <p>
            Gradie is a creative tool that turns any image into a smooth CSS
            gradient. Upload an image and Gradie will extract its dominant
            colors and turn them into a gradient “vibe” you can use as a
            background, wallpaper, or design element.
          </p>
        </div>

        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            How do I upload an image?
          </h3>
          <p>
            You can drag and drop, paste or select a file manually.
            {/* or (on mobile)
            even snap a pic with your camera. */}
          </p>
        </div>

        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            How does it generate gradients?
          </h3>
          <p>
            Gradie picks out the most prominent colors in the image and then
            creates a gradient based on the mode you choose.
          </p>
        </div>

        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            What are the gradient modes?
          </h3>
          <ul className="custom-marker-list space-y-1">
            <li>
              <strong>Default:</strong> Most prominent color + second-most
              prominent.
            </li>
            <li>
              <strong>Surprise Me!:</strong> Most prominent color + a random
              pick from the rest of the palette.
            </li>
            <li>
              <strong>Bold Pop:</strong> Most prominent color + the most
              visually contrasting color in the palette. Great for high-impact,
              energetic gradients.
            </li>
            <li>
              <strong>Soft Sweep:</strong> Most prominent color + the palette
              color with the most different hue.
            </li>
            <li>
              <strong>Full Blend:</strong> Uses all five palette colors to
              create a multi-stop gradient.
            </li>
            <li>
              <strong>Custom:</strong> You choose any two colors from the
              extracted palette to create your own combo.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            What color spaces can I use?
          </h3>
          <p>
            Gradie lets you interpolate in modern color spaces like{" "}
            <Code>srgb</Code>, <Code>hsl</Code>, <Code>hwb</Code>,{" "}
            <Code>lab</Code>, <Code>lch</Code>, <Code>oklab</Code>, and{" "}
            <Code>oklch</Code>.
          </p>
        </div>

        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            Can I export my gradient?
          </h3>
          <p className="mb-2">
            Yep. You can copy the CSS or download the gradient as an image. The
            download dialog lets you choose:
          </p>
          <ul className="custom-marker-list space-y-1">
            <li>Format (PNG, JPEG, WEBP, SVG)</li>
            <li>Dimensions (from original image, presets, custom, etc)</li>
            <li>Filename (default based on original image)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            What kind of data do you collect?
          </h3>
          <p>
            Nothing by default. Analytics are off until you opt in. Gradie
            doesn't store any of your images. I use PostHog, and you can read
            exactly what's tracked{" "}
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-foreground hover:text-primary cursor-pointer font-medium underline underline-offset-4">
                  here
                </span>
              </DialogTrigger>
              <AnalyticsDialogContent />
            </Dialog>
            .
          </p>
        </div>

        <div>
          <h3 className="text-primary font-aladin w-full scroll-m-20 pb-4 text-3xl font-semibold tracking-tight">
            Want more context?
          </h3>
          <p>
            Contact me using any of the links below. I also wrote a short
            article about Gradie's color switcher. Read it{" "}
            <a
              href="https://jemeni11.hashnode.dev/gradie-notes-1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary inline-flex cursor-pointer items-center gap-1 font-medium underline underline-offset-4"
            >
              <span>here</span>
              <LinkIcon className="size-4" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
