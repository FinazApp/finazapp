import dayjs from "dayjs";
import Box from "@mui/joy/Box";
import * as React from "react";
import Stack from "@mui/joy/Stack";
import { capitalize } from "radash";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import Grid from "@mui/material/Grid2";
import { AgCharts } from "ag-charts-react";
import Typography from "@mui/joy/Typography";
import { createColumnHelper } from "@tanstack/react-table";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { DataTable, IKPICardProps, KPICard } from "@components";
import {
  useDashboardGenerateReport,
  useFetchCategories,
  useFetchDashboardSummary,
} from "@hooks";

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
    cell: (info) => {
      const isIncome = info.row.original.tipo === "Ingreso";
      return (
        <span style={{ color: isIncome ? "green" : "red", fontWeight: 500 }}>
          {isIncome ? "+ " : "- "}
          {new Intl.NumberFormat("es-DO", {
            style: "currency",
            currency: "DOP",
          }).format(info.getValue())}
        </span>
      );
    },
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
      ];
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

  const categories = useFetchCategories();
  const dashboard = useFetchDashboardSummary(startDate, endDate);
  const reportCsv = useDashboardGenerateReport(startDate, endDate);

  const handleOnGenerateReport = React.useCallback(() => {
    return toast.promise(
      reportCsv.mutateAsync(
        { startDate, endDate },
        {
          onSuccess: ({ url }) => {
            window.open(url, "_blank");
          },
        }
      ),
      {
        error: (e) => e,
        loading: "Generando reporte...",
        success: "Reporte generado correctamente.",
      }
    );
  }, [endDate, reportCsv, startDate]);

  const datesOptions = [
    { label: "Este mes", value: "1" },
    { label: "Ultimo mes", value: "2" },
    { label: "Este año", value: "3" },
    { label: "Ultimo año", value: "4" },
  ];

  const stats: IKPICardProps[] = [
    {
      title: "Balance",
      color: "primary",
      data: dashboard.data?.porcentajes.balance,
      value: dashboard.data?.totales.balance ?? 0,
    },
    {
      title: "Gastos",
      color: "danger",
      data: dashboard.data?.porcentajes.gastos,
      value: dashboard.data?.totales.gastos ?? 0,
    },
    {
      title: "Ingresos",
      color: "success",
      data: dashboard.data?.porcentajes.ingresos,
      value: dashboard.data?.totales.ingresos ?? 0,
    },
  ];

  const data = React.useMemo(() => {
    return dashboard.data?.categoriasUsadas.map((category) => {
      const categoryFound = categories.data?.find(
        (item) => item.categoriaId === category.categoria
      );
      return {
        asset: categoryFound?.nombre ?? "",
        amount: category.total ?? 0,
      };
    });
  }, [categories.data, dashboard.data?.categoriasUsadas]);

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
            {datesOptions.map((option) => (
              <Button key={option.label} value={option.value}>
                {option.label}
              </Button>
            ))}
          </ToggleButtonGroup>
          <Button
            color="primary"
            onClick={handleOnGenerateReport}
            startDecorator={<DownloadRoundedIcon />}
          >
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
          <KPICard key={stat.title} {...stat} />
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
            <AgCharts
              options={{
                data,
                title: {
                  text: "Gastos por categorías",
                },
                series: [
                  {
                    type: "pie",
                    angleKey: "amount",
                    legendItemKey: "asset",
                  },
                ],
              }}
            />
          </Stack>
        </Grid>
        <Grid size={8}>
          <Typography level="title-lg" mb={1} component="h1">
            Ultimas transacciones
          </Typography>
          <DataTable
            columns={columns}
            tableActions={[]}
            data={dashboard.data?.ultimosMovimientos ?? []}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
