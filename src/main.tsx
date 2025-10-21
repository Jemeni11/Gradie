import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

posthog.init(import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY ?? "", {
  api_host: import.meta.env.VITE_APP_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
  persistence: "memory",
  opt_out_persistence_by_default: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
);
