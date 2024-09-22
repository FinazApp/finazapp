import React from "react";
import { FormatNumber } from "@ark-ui/react";
import { Box, Divider, Flex, Grid } from "styled-system/jsx";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";

import { Text, Card, Heading, MainLayout, RadioButtonGroup } from "@components";

export interface IStatCardProps {
  title: string;
  value: number;
  data: {
    percent: number;
    type: "down" | "up";
  };
}

const StatCard = ({ title, value, data }: IStatCardProps) => {
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
                mr="2"
                size="sm"
                fontWeight="500"
                color={data.type === "down" ? "red" : "green"}
              >
                {data.percent}%
              </Text>
              <Text size="sm" fontWeight="500">
                desde la ultima semana
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Card.Root>
  );
};

function App() {
  const [filter, setFilter] = React.useState("Este Mes");

  const options = [
    { value: "Este Mes" },
    { value: "Ultimo Mes" },
    { value: "Ultimo año" },
  ];

  const stats: IStatCardProps[] = [
    {
      title: "Balance",
      value: 500000,
      data: {
        type: "down",
        percent: 5,
      },
    },
    {
      title: "Gastos",
      value: 500000,
      data: {
        type: "up",
        percent: 5,
      },
    },
    {
      title: "Ingresos",
      value: 500000,
      data: {
        type: "down",
        percent: 5,
      },
    },
  ];

  return (
    <MainLayout>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text as="span" fontWeight="medium" color="neutral.11" size="md">
            Bienvenido de nuevo,
          </Text>
          <Heading as="h1" size="3xl">
            Johan Sierra Linares
          </Heading>
        </Box>
        <RadioButtonGroup.Root
          value={filter}
          onValueChange={(details) => setFilter(details.value)}
        >
          {options.map((option, id) => (
            <RadioButtonGroup.Item key={id} value={option.value}>
              <RadioButtonGroup.ItemControl />
              <RadioButtonGroup.ItemText>
                {option.value}
              </RadioButtonGroup.ItemText>
              <RadioButtonGroup.ItemHiddenInput />
            </RadioButtonGroup.Item>
          ))}
        </RadioButtonGroup.Root>
      </Flex>
      <Divider />
      <Grid columns={3} columnGap="5">
        {stats.map((stat) => (
          <StatCard {...stat} />
        ))}
      </Grid>
    </MainLayout>
  );
}

export default App;
