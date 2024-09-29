import React from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { MainLayout, RegisterPage } from "@components";
import { DashboardPage, IncomesPage, BillPage } from "@pages";

function App() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout withOutlet />,
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
          element: <BillPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
      ],
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
