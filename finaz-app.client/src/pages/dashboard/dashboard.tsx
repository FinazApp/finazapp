import React from "react";
import { Grid } from "styled-system/jsx";

import { RadioButtonGroup, IKPICardProps, KPICard, Header } from "@components";

const DashboardPage = () => {
  const [filter, setFilter] = React.useState("Este Mes");

  const options = [
    { value: "Este Mes" },
    { value: "Ultimo Mes" },
    { value: "Ultimo año" },
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
        }
      />
      <Grid columns={3} columnGap="5">
        {stats.map((stat) => (
          <KPICard {...stat} />
        ))}
      </Grid>
    </>
  );
};

export default DashboardPage;
