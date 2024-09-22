import React from "react";
import { IconHome } from "@tabler/icons-react";
import { Box, Flex } from "styled-system/jsx";

import { NavLink } from "../navlink";
import { Avatar, Heading } from "../park-ui";

const Sidebar = () => {
  return (
    <Flex
      p="4"
      w="64"
      h="full"
      bg="Background"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Flex flexDir="column" gap="5">
        <Heading as="h2" size="2xl">
          FinazApp
        </Heading>
        <Flex id="Navbar" flexDir="column" flex={1} gap="2">
          <NavLink
            title="Inicio"
            icon={<IconHome stroke={2} size="20" style={{ width: 20, height: 20 }} />}
          />
          <NavLink
            title="Ingresos"
            icon={<IconHome stroke={2} size="20" style={{ width: 20, height: 20 }} />}
          />
          <NavLink
            title="Gastos"
            icon={<IconHome stroke={2} size="20" style={{ width: 20, height: 20 }} />}
          />
        </Flex>
      </Flex>
      <Box bg="yellow" p="2">
        <Avatar src="https://i.pravatar.cc/300" name="John Doe" />
      </Box>
    </Flex>
  );
};

export default Sidebar;
