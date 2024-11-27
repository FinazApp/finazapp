import React from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import { createColumnHelper } from "@tanstack/react-table";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { DataTable, IKPICardProps, KPICard } from "@components";

const columnHelper = createColumnHelper<{
  nombre: string;
  tipo: string;
  monto: number;
}>();

const columns = [
  columnHelper.accessor("tipo", {
    id: "categoriaId",
    header: "Tipo",
  }),
  columnHelper.accessor("nombre", {
    id: "nombre",
    header: "Nombre",
    cell: (info) => <b>{info.getValue()}</b>,
  }),
  columnHelper.accessor("monto", {
    id: "monto",
    header: "Monto",
  }),
];

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
      value: 5000,
      color: "primary",
      data: {
        type: "down",
        percent: 43,
      },
    },
    {
      title: "Gastos",
      value: 500000,
      color: "danger",
      data: {
        type: "up",
        percent: 53,
      },
    },
    {
      title: "Ingresos",
      value: 500000,
      color: "success",
      data: {
        type: "down",
        percent: 23,
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
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <ToggleButtonGroup
            value={filter}
            size="md"
            onChange={(_, newValue) => {
              setFilter(newValue ?? "");
            }}
          >
            {options.map((option) => (
              <Button key={option.label} value={option.value}>
                {option.label}
              </Button>
            ))}
          </ToggleButtonGroup>
          <Button color="primary" startDecorator={<DownloadRoundedIcon />}>
            Descargar reporte
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {stats.map((stat) => (
          <KPICard {...stat} />
        ))}
      </Box>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid size={4}>
          <Stack
            direction="row"
            paddingY="20px"
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Grafico aqui
          </Stack>
        </Grid>
        <Grid size={8}>
          <DataTable
            data={[
              {
                monto: 100,
                nombre: "Hello",
                tipo: "Hello",
              },
            ]}
            columns={columns}
            tableActions={[]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
