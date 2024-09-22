import React from "react";
import { IconHome } from "@tabler/icons-react";
import { Box, Flex } from "styled-system/jsx";

import { NavLink } from "../navlink";
import { Avatar, Heading, Text } from "../park-ui";

const Sidebar = () => {
  return (
    <Flex
      w="64"
      h="full"
      bg="Background"
      boxShadow="lg"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box p="4">
        <Heading as="h2" size="2xl">
          FinazApp
        </Heading>
      </Box>
      <Flex id="Navbar" flexDir="column" flex={1} gap="2" px="4">
        <NavLink to="/" title="Inicio" icon={IconHome} />
        <NavLink to="/incomes" title="Ingresos" icon={IconHome} />
        <NavLink to="/expenses" title="Gastos" icon={IconHome} />
      </Flex>
      <Flex px="4" py="2" _hover={{ bg: "red" }} gap="2">
        <Avatar src="https://i.pravatar.cc/300" name="John Doe" />
        <Box>
          <Text size="sm" fontWeight="semibold">
            Johan Sierra Linares
          </Text>
          <Text size="xs" color="neutral.10">
            johan@finazapp.com
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
