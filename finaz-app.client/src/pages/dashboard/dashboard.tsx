import React from "react";
import { Grid } from "styled-system/jsx";

import {
  RadioButtonGroup,
  IKPICardProps,
  KPICard,
  Header,
  Card,
  Button,
} from "@components";
import { IconFileExport } from "@tabler/icons-react";

const DashboardPage = () => {
  const [filter, setFilter] = React.useState("1");

  const options = [
    { label: "Este Mes", value: "1" },
    { label: "Ultimo Mes", value: "2" },
    { label: "Ultimo año", value: "3" },
  ];

  const stats: IKPICardProps[] = [
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
    <>
      <Header
        title="Johan Sierra Linares"
        subtitle="Bienvenido de nuevo,"
        rightContent={
          <>
            <RadioButtonGroup.Root
              value={filter}
              onValueChange={(details) => setFilter(details.value)}
            >
              {options.map((option, id) => (
                <RadioButtonGroup.Item key={id} value={option.value}>
                  <RadioButtonGroup.ItemControl />
                  <RadioButtonGroup.ItemText>
                    {option.label}
                  </RadioButtonGroup.ItemText>
                  <RadioButtonGroup.ItemHiddenInput />
                </RadioButtonGroup.Item>
              ))}
            </RadioButtonGroup.Root>
            <Button colorPalette="neutral" variant="subtle">
              Exportar
              <IconFileExport size="20" style={{ height: 20, width: 20 }} />
            </Button>
          </>
        }
      />
      <Grid columns={{ sm: 1, md: 2, lg: 3 }} columnGap={5} rowGap={5}>
        {stats.map((stat) => (
          <KPICard {...stat} />
        ))}
      </Grid>
      <Grid columns={3} columnGap={5} rowGap={5}>
        <Card.Root h="full" p="2">
          {`{{charts}}`}
        </Card.Root>
        <Card.Root h="full" p="2">
          {`{{table}}`}
        </Card.Root>
      </Grid>
    </>
  );
};

export default DashboardPage;
