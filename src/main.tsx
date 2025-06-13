import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PostHogProvider } from "posthog-js/react";
import type { PostHogConfig } from "posthog-js";

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_APP_PUBLIC_POSTHOG_HOST,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY ?? ""}
      options={options}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
);
