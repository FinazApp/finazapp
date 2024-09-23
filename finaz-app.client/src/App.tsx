import React from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { MainLayout } from "@components";
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
      ],
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
