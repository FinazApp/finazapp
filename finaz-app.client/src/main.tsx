import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IngresosCRUD from "./page/ingresos.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="ingresos" element={<IngresosCRUD />} />
      </Routes>
      <App />
    </BrowserRouter>
  </StrictMode>
);
