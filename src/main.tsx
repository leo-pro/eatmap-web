import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter";
import { AppProvider } from "@/app/providers/app-provider";
import { router } from "@/app/router";
import { initializeSentry } from "@/integrations/sentry";
import "@/styles/globals.css";

initializeSentry(router);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>,
);
