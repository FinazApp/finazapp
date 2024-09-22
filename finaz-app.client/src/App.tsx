import React from "react";
import { FormatNumber } from "@ark-ui/react";
import { Box, Divider, Flex } from "styled-system/jsx";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Heading, MainLayout, RadioButtonGroup, Text } from "@components";

export interface IStatCardProps {
  title: string;
}

const StatCard = ({ title }: IStatCardProps) => {
  return (
    <Flex flexDirection="column" flex={1} px="4" py="5" bg="red.5" borderRadius="lg">
      <Text as="span" size="md" fontWeight="bold">
        {title}
      </Text>
      <Box mt="3">
        <Heading as="h3" size="3xl">
          <FormatNumber value={5000000} />
        </Heading>
        <Flex alignItems="center">
          <IconArrowUpRight
            size="20"
            stroke={2}
            style={{ height: 20, width: 20, color: "green" }}
          />
          <Text size="sm" fontWeight="500" color="green" mr="2">
            32%
          </Text>
          <Text size="sm" fontWeight="500">
            from the last week
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

function App() {
  const options = [
    { value: "Este Mes" },
    { value: "Ultimo Mes" },
    { value: "Ultimo trimestre" },
    { value: "Ultimo año" },
  ];

  return (
    <MainLayout>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text as="span" fontWeight="500" color="neutral.11" size="sm">
            Bienvenido de nuevo,
          </Text>
          <Heading as="h1" size="2xl">
            Johan Sierra Linares
          </Heading>
        </Box>
        <RadioButtonGroup.Root defaultValue="Este Mes">
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
      {/* Stats */}
      <Divider />
      <Flex justifyContent="space-between" flexWrap="wrap" gap="5">
        <StatCard title="Gastos" />
        <StatCard title="Balance" />
        <StatCard title="Ingresos" />
        <StatCard title="Ingresos" />
      </Flex>
    </MainLayout>
  );
}

export default App;
