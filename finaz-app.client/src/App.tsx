import React from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { ErrorBoundary, MainLayout } from "@components";
import { DashboardPage, IncomesPage, BillsPage, RegisterPage, LoginPage } from "@pages";

function App() {
  const routes: RouteObject[] = [
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
          path: "bills",
          id: "bills-page",
          element: <BillsPage />,
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
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
