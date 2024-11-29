import React from "react";
import dayjs from "dayjs";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import { createColumnHelper } from "@tanstack/react-table";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { DataTable, IKPICardProps, KPICard } from "@components";
import { useFetchDashboardBalance } from "@hooks";
import { capitalize } from "radash";

const columnHelper = createColumnHelper<{
  nombre: string;
  tipo: string;
  monto: number;
}>();

const columns = [
  columnHelper.accessor("nombre", {
    id: "nombre",
    header: "Nombre",
    cell: (info) => <b>{info.getValue()}</b>,
  }),
  columnHelper.accessor("monto", {
    id: "monto",
    header: "Monto",
    cell: (info) => (
      <span>
        {new Intl.NumberFormat("es-DO", {
          style: "currency",
          currency: "DOP",
        }).format(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("tipo", {
    id: "tipo",
    header: "Tipo",
    cell: (info) => <span>{capitalize(info.getValue())}</span>,
  }),
];

const DashboardPage = () => {
  const [filter, setFilter] = React.useState("1");

  const [startDate, endDate] = React.useMemo(() => {
    if (filter === "2") {
      const lastMonth = dayjs().subtract(1, "month");
      return [
        lastMonth.startOf("month").format("DD/MM/YYYY"),
        lastMonth.endOf("month").format("DD/MM/YYYY"),
      ]
    }
    if (filter === "3") {
      return [
        dayjs().startOf("year").format("DD/MM/YYYY"),
        dayjs().endOf("year").format("DD/MM/YYYY"),
      ];
    }
    if (filter === "4") {
      const lastYear = dayjs().subtract(1, "year");
      return [
        lastYear.startOf("year").format("DD/MM/YYYY"),
        lastYear.endOf("year").format("DD/MM/YYYY"),
      ];
    }
    return [
      dayjs().startOf("month").format("DD/MM/YYYY"),
      dayjs().endOf("month").format("DD/MM/YYYY"),
    ];
  }, [filter]);

  const dashboard = useFetchDashboardBalance(startDate, endDate);

  const options = [
    { label: "Este mes", value: "1" },
    { label: "Ultimo mes", value: "2" },
    { label: "Este año", value: "3" },
    { label: "Ultimo año", value: "4" },
  ];

  const stats: IKPICardProps[] = [
    {
      title: "Balance",
      value: dashboard.data?.kpi.balance.value ?? 0,
      color: "primary",
      data: {
        type: "down",
        percent: dashboard.data?.kpi.balance.percentage ?? 0,
      },
    },
    {
      title: "Gastos",
      value: dashboard.data?.kpi.gastos.value ?? 0,
      color: "danger",
      data: {
        type: "up",
        percent: dashboard.data?.kpi.gastos.percentage ?? 0,
      },
    },
    {
      title: "Ingresos",
      value: dashboard.data?.kpi.ingresos.value ?? 0,
      color: "success",
      data: {
        type: "down",
        percent: dashboard.data?.kpi.ingresos.percentage ?? 0,
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
            columns={columns}
            tableActions={[]}
            data={dashboard.data?.last ?? []}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
