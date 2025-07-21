import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import {
  Header,
  Hero,
  GradientPanel,
  GradientPreview,
  FAQ,
  Footer,
} from "@/components/views";
import ImageUploadInput from "@/components/image";
import Banner from "@/components/views/banner";
import { usePostHog } from "posthog-js/react";
import { useImageUpload } from "@/hooks/useImageUpload";
import defaultGradients from "@/constants/defaultGradient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "@/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImageUploadDropArea from "@/components/image/image-upload-drop-area";

export default function App() {
  const posthog = usePostHog();
  const [showBanner, setShowBanner] = useState(false);

  const [index, setIndex] = useState(
    Math.floor(Math.random() * defaultGradients.length),
  );
  const currentGradient = defaultGradients[index];

  const [opacity, setOpacity] = useState(1);

  const {
    dragIsOver,
    successAnimation,
    dropAreaRef,
    fileInputRef,
    filesWithError,
    validFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    addFiles,
  } = useImageUpload();

  const handleEnableAnalytics = () => {
    localStorage.setItem("gradie-analytics-consent", "true");
    posthog?.opt_in_capturing();
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("gradie-analytics-consent", "false");
    setShowBanner(false);
  };

  useEffect(() => {
    const analyticsConsent = localStorage.getItem("gradie-analytics-consent");
    if (analyticsConsent === "true") {
      posthog?.opt_in_capturing();
    } else if (analyticsConsent === null) {
      // Show banner only if user hasn’t decided
      setShowBanner(true);
    }
  }, [posthog]);

  const fadeDuration = 1000;
  const displayDuration = 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0); // start fade out

      setTimeout(() => {
        setIndex((i) => (i + 1) % defaultGradients.length);
        setOpacity(1); // fade in new gradient
      }, fadeDuration);
    }, displayDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Toaster richColors closeButton />
      {showBanner && (
        <Banner onEnable={handleEnableAnalytics} onDismiss={handleDismiss} />
      )}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:h-screen">
        <Header />
        <Hero />
        {validFile ? (
          <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
            <ImageUploadInput className="aspect-video w-full" />
            <GradientPanel />
          </div>
        ) : (
          <div>
            <div className="my-8 inline-flex w-full justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer font-medium"
                    type="button"
                  >
                    Upload an image
                  </Button>
                </DialogTrigger>
                <DialogContent className="md:max-h-auto h-full max-h-[80%] max-w-xl overflow-y-scroll md:min-h-[95%] md:overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Upload an image</DialogTitle>
                    <DialogDescription>
                      <span>Create a vibe</span>
                      <span className="animate-bounce">✨</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full space-y-4 text-sm">
                    <ImageUploadDropArea
                      dragIsOver={dragIsOver}
                      dropAreaRef={dropAreaRef}
                      fileInputRef={fileInputRef}
                      handleDragOver={handleDragOver}
                      handleDragLeave={handleDragLeave}
                      handleDrop={handleDrop}
                      addFiles={addFiles}
                      successAnimation={successAnimation}
                      className="max-h-[70%]"
                    />
                    <Alert className="border-gradie-2">
                      <InfoIcon className="size-4 animate-pulse motion-reduce:animate-none" />
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        Images only. Only one image will be used.
                      </AlertDescription>
                    </Alert>
                    <div className="flex flex-col gap-2">
                      {filesWithError?.map((file) => (
                        <p
                          key={file.key}
                          className="text-sm text-red-700"
                          role="alert"
                        >
                          {file.status.map((status) => status + "\n")}
                        </p>
                      ))}
                    </div>
                  </div>
                  <DialogFooter className="mt-4 block md:hidden">
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
            </div>
            <div className="border-gradie-1 rounded-lg border border-solid p-2">
              <GradientPreview
                gradient={currentGradient}
                className="inset-0 transition-opacity duration-1000"
                styles={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity,
                }}
              />
            </div>
          </div>
        )}
        <FAQ />
        <div className="mt-8">
          TODO
          <ul className="custom-marker-list space-y-1">
            <li>update ui of uploader</li>
            <li>???</li>
            <li>profit (lol)</li>
          </ul>
        </div>
        <Footer />
      </div>
    </>
  );
}
