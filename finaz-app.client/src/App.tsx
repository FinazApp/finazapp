import React from "react";
import { Toaster } from "react-hot-toast";
import CssBaseline from "@mui/joy/CssBaseline";
import { AuthContextProvider } from "@contexts";
import { CssVarsProvider } from "@mui/joy/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary, MainLayout } from "@components";
import { RouteObject, RouterProvider } from "react-router";
import {
  DashboardPage,
  IncomesPage,
  BillsPage,
  RegisterPage,
  LoginPage,
  CategoriesPage,
  SavingsPage,
  UsersPage,
  StatePage,
} from "@pages";

import queryClient from "./query.config.ts";

function App() {
  const routes: RouteObject[] = React.useMemo(
    () => [
      {
        path: "/",
        element: <MainLayout withOutlet />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            index: true,
            id: "dashboard-page",
            element: <DashboardPage />,
          },
          {
            path: "incomes",
            id: "incomes-page",
            element: <IncomesPage />,
          },
          {
            path: "categories",
            id: "categories-page",
            element: <CategoriesPage />,
          },
          {
            path: "bills",
            id: "bills-page",
            element: <BillsPage />,
          },
          {
            path: "savings",
            id: "savings-page",
            element: <SavingsPage />,
          },
          {
            path: "users",
            id: "users-page",
            element: <UsersPage />,
          },
          {
            path: "state",
            id: "state-page",
            element: <StatePage />,
          },
        ],
      },
      {
        id: "register-page",
        path: "register",
        element: <RegisterPage />,
      },
      {
        id: "login-page",
        path: "login",
        element: <LoginPage />,
      },
    ],
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider>
        <CssBaseline />
        <AuthContextProvider>
          <RouterProvider router={createBrowserRouter(routes)} />
        </AuthContextProvider>
      </CssVarsProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
