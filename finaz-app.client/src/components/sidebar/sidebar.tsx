import React from "react";
import { Box, Flex } from "styled-system/jsx";
import {
  IconX,
  IconHome2,
  IconPigMoney,
  IconCurrencyDollar,
} from "@tabler/icons-react";

import { NavLink } from "../navlink";
import { Drawer } from "../park-ui/drawer";
import { Avatar, Heading, IconButton, Text } from "../park-ui";

type DrawerRootProps = React.ComponentProps<typeof Drawer.Root>;

export interface SidebarProps {
  (): React.JSX.Element;
  Drawer: React.FC<DrawerRootProps>;
}

const SidebarContent = () => {
  return (
    <>
      <Flex id="Navbar" flexDir="column" flex={1} gap="2" px="4">
        <NavLink to="/" title="Inicio" icon={IconHome2} />
        <NavLink to="/incomes" title="Ingresos" icon={IconPigMoney} />
        <NavLink to="/bills" title="Gastos" icon={IconCurrencyDollar} />
      </Flex>
      <Flex px="4" py="2" _hover={{ bg: "Silver" }} gap="2">
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
    </>
  );
};

const Sidebar: SidebarProps = () => {
  return (
    <Flex
      w="64"
      h="full"
      bg="Background"
      boxShadow="lg"
      flexDirection="column"
      justifyContent="space-between"
      display={{ lgDown: "none", lg: "flex" }}
    >
      <Box p="4">
        <Heading as="h2" size="2xl">
          FinazApp
        </Heading>
      </Box>
      <SidebarContent />
    </Flex>
  );
};

Sidebar.Drawer = ({ children, ...props }) => {
  return (
    <Drawer.Root variant="left" {...props}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>FinazApp</Drawer.Title>
            <Drawer.CloseTrigger asChild position="absolute" top="3" right="4">
              <IconButton variant="ghost">
                <IconX />
              </IconButton>
            </Drawer.CloseTrigger>
          </Drawer.Header>
          <Drawer.Body className="p-0 m-0">
            <SidebarContent />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default Sidebar;
