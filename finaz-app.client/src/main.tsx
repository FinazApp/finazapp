import React from "react";
import { StrictMode } from "react";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import queryClient from "./query.config.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssVarsProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" />
      </QueryClientProvider>
    </CssVarsProvider>
  </StrictMode>
);
