import { Toaster } from "@/components/ui/sonner";
import { Header, Hero, GradientPanel, Wiki, Footer } from "@/components/views";
import ImageUploadInput from "@/components/image-upload-input";
import { usePostHog } from "posthog-js/react";

export default function App() {
  const posthog = usePostHog();

  posthog?.opt_in_capturing();

  return (
    <>
      <Toaster richColors closeButton />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:h-screen">
        <Header />
        <Hero />
        <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
          <ImageUploadInput className="aspect-video w-full" />
          <GradientPanel />
        </div>
        <Wiki />
        <div className="mt-8">
          TODO
          <ul>
            <li>Bug: fix colour banding on certain linear gradients</li>
            <li>add wiki/faq</li>
            <li>update ui of uploader</li>
            <li>analytics</li>
            <li>mobile responsiveness</li>
            <li>???</li>
            <li>profit (lol)</li>
          </ul>
        </div>
        <Footer />
      </div>
    </>
  );
}
