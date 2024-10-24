import React from "react";
import { Box, Flex } from "styled-system/jsx";

import { Heading, Text } from "../park-ui";

export interface IHeaderProps {
  title: string;
  subtitle: string;
  rightContent?: React.ReactNode;
}

const Header = ({ subtitle, title, rightContent }: IHeaderProps) => {
  return (
    <Box bg="Background" borderRadius="lg" boxShadow="lg">
      <Flex
        p={4}
        flexWrap="wrap"
        gap={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Text as="span" fontWeight="medium" color="neutral.11" size="md">
            {subtitle}
          </Text>
          <Heading as="h1" size={["2xl", "3xl"]}>
            {title}
          </Heading>
        </Box>
        <Flex gap="5">{rightContent}</Flex>
      </Flex>
    </Box>
  );
};

export default Header;
