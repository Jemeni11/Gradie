declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Event tracker for lightweight analytics.
 */
export const trackEvent = (eventName: string, props?: Record<string, unknown>) => {
  const consent = localStorage.getItem("gradie-analytics-consent") === "true";
  if (!consent || typeof window === "undefined") return;

  if (typeof window.umami === "object" && typeof window.umami.track === "function") {
    window.umami.track(eventName, props);
  }
};

/**
 * Injects the Umami script into the document head if consent is given.
 */
export const initAnalytics = () => {
  const consent = localStorage.getItem("gradie-analytics-consent") === "true";
  if (!consent || typeof window === "undefined") return;

  // Prevent multiple injections
  if (document.querySelector('script[src*="umami.is"]')) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://cloud.umami.is/script.js";
  script.setAttribute("data-website-id", "7baf1f4c-1bdf-42f2-b2dd-f9da7b2fc209");

  document.head.appendChild(script);
};
