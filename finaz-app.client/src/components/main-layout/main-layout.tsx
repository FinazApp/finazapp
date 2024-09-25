import React from "react";
import { Outlet } from "react-router";
import { Flex } from "styled-system/jsx";

import { Sidebar } from "../sidebar";

export interface IMainLayoutProps {
  withOutlet?: boolean;
}

const MainLayout = ({
  children,
  withOutlet,
}: React.PropsWithChildren<IMainLayoutProps>) => {
  return (
    <Flex h="screen" w="screen" bg="neutral.2">
      <Sidebar />
      <Flex flex={1} overflow="auto" flexDir="column" p="4" gap="4">
        {withOutlet ? <Outlet /> : children}
      </Flex>
    </Flex>
  );
};

export default MainLayout;
