import React from "react";
import { Toaster } from "react-hot-toast";
import CssBaseline from "@mui/joy/CssBaseline";
import { AuthContextProvider } from "@contexts";
import { CssVarsProvider } from "@mui/joy/styles";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "./query.config.ts";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider>
        <CssBaseline />
        <AuthContextProvider />
      </CssVarsProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
