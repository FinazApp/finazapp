import React from "react";
import { Outlet } from "react-router";
import { Box, Flex } from "styled-system/jsx";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";

import { Sidebar } from "../sidebar";

export interface IMainLayoutProps {
  withOutlet?: boolean;
}

const MainLayout = ({
  children,
  withOutlet,
}: React.PropsWithChildren<IMainLayoutProps>) => {
  const [sidebarMobileCollapsed, setSidebarMobileCollapsed] =
    React.useState(true);

  return (
    <Flex h="screen" w="screen" bg="neutral.2">
      <Sidebar />
      <Box display={{ mdDown: "block", lg: "none" }}>
        <Sidebar.Drawer
          open={!sidebarMobileCollapsed}
          onOpenChange={(details) => setSidebarMobileCollapsed(!details.open)}
        />
      </Box>
      <Flex p="4" gap="4" flex={1} overflow="auto" flexDir="column">
        <Box
          p={2}
          boxShadow="lg"
          bg="Background"
          cursor="pointer"
          borderRadius="sm"
          width="fit-content"
          display={{ mdDown: "flex", lg: "none" }}
          onClick={() => setSidebarMobileCollapsed(false)}
        >
          {sidebarMobileCollapsed ? (
            <IconLayoutSidebarLeftExpand
              size="24"
              style={{ width: 24, height: 24 }}
            />
          ) : (
            <IconLayoutSidebarLeftCollapse
              size="24"
              style={{ width: 24, height: 24 }}
            />
          )}
        </Box>
        {withOutlet ? <Outlet /> : children}
      </Flex>
    </Flex>
  );
};

export default MainLayout;
