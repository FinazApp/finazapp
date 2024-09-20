import React from "react";
import { Flex } from "styled-system/jsx";

import { Sidebar } from "../sidebar";

export type IMainLayoutProps = React.PropsWithChildren;

const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <Flex h="screen" bg="neutral.2">
      <Sidebar />
      <Flex flex={1} flexDir="column" p="4" gap="4">
        {children}
      </Flex>
    </Flex>
  );
};

export default MainLayout;
