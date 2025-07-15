import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Header, Hero, GradientPanel, Wiki, Footer } from "@/components/views";
import ImageUploadInput from "@/components/image-upload-input";
import Banner from "@/components/views/banner";
import { usePostHog } from "posthog-js/react";

export default function App() {
  const posthog = usePostHog();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const analyticsConsent = localStorage.getItem("gradie-analytics-consent");
    if (analyticsConsent === "true") {
      posthog?.opt_in_capturing();
    } else if (analyticsConsent === null) {
      // Show banner only if user hasn’t decided
      setShowBanner(true);
    }
  }, [posthog]);

  const handleEnableAnalytics = () => {
    localStorage.setItem("gradie-analytics-consent", "true");
    posthog?.opt_in_capturing();
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("gradie-analytics-consent", "false");
    setShowBanner(false);
  };

  return (
    <>
      <Toaster richColors closeButton />
      {showBanner && (
        <Banner onEnable={handleEnableAnalytics} onDismiss={handleDismiss} />
      )}
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
