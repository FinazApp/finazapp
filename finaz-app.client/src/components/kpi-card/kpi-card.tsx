import React from "react";
import { FormatNumber } from "@ark-ui/react";
import { Box, Flex } from "styled-system/jsx";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";

import { Text, Card, Heading } from "@components";

export interface IKPICardProps {
  title: string;
  value: number;
  data: {
    percent: number;
    type: "down" | "up";
  };
}

const KPICard = ({ title, value, data }: IKPICardProps) => {
  return (
    <Card.Root>
      <Flex flexDirection="column" px="4" py="5" borderRadius="lg">
        <Text as="span" size="md" color="neutral.11" fontWeight="medium">
          {title}
        </Text>
        <Box mt="2">
          <Heading as="h3" fontWeight="semibold" size="3xl">
            <FormatNumber value={value} style="currency" currency="USD" />
          </Heading>
          {data && (
            <Flex alignItems="center">
              {data.type === "down" ? (
                <IconArrowDownRight
                  size="20"
                  stroke={2}
                  style={{ height: 20, width: 20, color: "red" }}
                />
              ) : (
                <IconArrowUpRight
                  size="20"
                  stroke={2}
                  style={{ height: 20, width: 20, color: "green" }}
                />
              )}
              <Text
                mr="1"
                size="sm"
                color={data.type === "down" ? "red" : "green"}
              >
                {data.percent}%
              </Text>
              <Text size="sm">desde la ultima semana</Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Card.Root>
  );
};

export default KPICard;
