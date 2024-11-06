import React from "react";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import { Outlet, useMatches } from "react-router";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import { IconHomeFilled } from "@tabler/icons-react";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { Sidebar } from "../sidebar";
import { Header } from "../header";

export interface IMainLayoutProps {
  withOutlet?: boolean;
}

const MainLayout = ({
  children,
  withOutlet,
}: React.PropsWithChildren<IMainLayoutProps>) => {
  const matches = useMatches();

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href={matches[0].pathname}
              aria-label="Home"
            >
              <IconHomeFilled size="16" style={{ width: 16, height: 16 }} />
            </Link>
            {matches.slice(1).map((match) => (
              <Link
              underline="hover"
              color="neutral"
              href={match.pathname}
              sx={{ fontSize: 12, fontWeight: 500 }}
            >
              Inicio
            </Link>
            ))}
            {/* <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
              Orders
            </Typography> */}
          </Breadcrumbs>
        </Box>
        {withOutlet ? <Outlet /> : children}
      </Box>
    </Box>
  );
};

export default MainLayout;
