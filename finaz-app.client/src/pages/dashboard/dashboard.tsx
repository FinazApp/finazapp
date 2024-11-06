import React from "react";
import Button from "@mui/joy/Button";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Box from "@mui/joy/Box";
import { IKPICardProps } from "@components";
import Typography from "@mui/joy/Typography";
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import OrderTable from "src/components/order-table";

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
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Inicio
        </Typography>
        <Box         sx={{
          display: "flex",
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}>
          <ToggleButtonGroup
            value={filter}
            size="md"
            onChange={(_, newValue) => {
              setFilter(newValue ?? "");
            }}
          >
            {options.map((option) => (
              <Button key={option.label} value={option.value}>{option.label}</Button>
            ))}
          </ToggleButtonGroup>
          <Button
            color="primary"
            startDecorator={<DownloadRoundedIcon />}
            size="sm"
          >
            Download PDF
          </Button>
        </Box>
      </Box>
      <OrderTable />
      {/* <Header
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
            {/* <Button colorPalette="neutral" variant="subtle">
              Exportar
              <IconFileExport size="20" style={{ height: 20, width: 20 }} />
            </Button> */}
      {/* // }
      // />
      // <Grid columns={{ sm: 1, md: 2, lg: 3 }} columnGap={5} rowGap={5}>
      //   {stats.map((stat) => (
      //     <KPICard {...stat} />
      //   ))}
      // </Grid>
      // <Grid columns={3} columnGap={5} rowGap={5}>
      //   <Card.Root h="full" p="2">
      //     {`{{charts}}`}
      //   </Card.Root>
      //   <Card.Root h="full" p="2">
      //     {`{{table}}`}
      //   </Card.Root>
      // </Grid> */}
    </>
  );
};

export default DashboardPage;
