import React from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { ErrorBoundary, MainLayout } from "@components";
import { DashboardPage, IncomesPage, BillsPage, RegisterPage } from "@pages";

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
          element: <DashboardPage />,
        },
        {
          path: "incomes",
          element: <IncomesPage />,
        },
        {
          path: "bills",
          element: <BillsPage />,
        },
      ],
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
