import React from "react";
import { StrictMode } from "react";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import queryClient from "./query.config.ts";
import { AuthContextProvider } from "@contexts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider renderLoading={(msg) => <>{msg}</>}>
        <CssVarsProvider>
          <CssBaseline />
          <App />
          <Toaster position="top-center" />
        </CssVarsProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
