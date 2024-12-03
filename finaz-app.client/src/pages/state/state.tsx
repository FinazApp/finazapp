import Box from "@mui/joy/Box";
import * as React from "react";
import { capitalize } from "radash";
import Typography from "@mui/joy/Typography";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable, IKPICardProps, KPICard } from "@components";
import { useFetchRecomendacion } from "@hooks";
import { Alert, Stack } from "@mui/joy";
import { IRecomendacion } from "@interfaces";

const columnHelper = createColumnHelper<{
  title: string;
  description: string;
}>();

const columns = [
  columnHelper.accessor("title", {
    id: "title",
    header: "Nombre",
    cell: (info) => <span>{capitalize(info.getValue())}</span>,
  }),
  columnHelper.accessor("description", {
    id: "description",
    header: "Descripción",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
];

const columnHelperCategoria =
  createColumnHelper<IRecomendacion["recomendacionGastosPorCategoria"][0]>();

const columnsCategoria = [
  columnHelperCategoria.accessor("categoria", {
    id: "categoria",
    header: "Nombre",
    cell: (info) => <span>{capitalize(info.getValue())}</span>,
  }),
  columnHelperCategoria.accessor("porcentajeGasto", {
    id: "porcentajeGasto",
    header: "Porcentaje gastado",
    cell: (info) => <span>{info.getValue().toFixed(2)}%</span>,
  }),
  columnHelperCategoria.accessor("recomendacion", {
    id: "recomendacion",
    header: "Recomendación",
  }),
];

const StatePage = () => {
  const recommendation = useFetchRecomendacion();

  const stats = [
    {
      color: "danger",
      title: "Gastos totales",
      value: recommendation.data?.totalGastos ?? 0,
      message: recommendation.data?.recomendacionGasto,
    },
    {
      color: "success",
      title: "Ingresos totales",
      value: recommendation.data?.totalIngresos ?? 0,
      message: recommendation.data?.recomendacionIngreso,
    },
    {
      color: "primary",
      title: "Ahorros totales",
      value: recommendation.data?.totalAhorros ?? 0,
      message: recommendation.data?.recomendacionAhorro,
    },
  ];

  const data = React.useMemo(() => {
    return [
      {
        title: "Ingresos mensuales",
        description: recommendation.data?.recomendacionIngresoMensual ?? "",
      },
      {
        title: "Deudas",
        description: recommendation.data?.recomendacionDeuda ?? "",
      },
    ];
  }, [recommendation.data]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: { xs: "start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Typography level="h2" component="h1">
          Estado general
        </Typography>
        <Typography level="body-sm">
          Aquí están tus recomendaciones financieras basadas en tus ingresos y
          gastos.
        </Typography>
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
          <Stack direction="column" flex={1} gap={2} key={stat.title}>
            <KPICard {...(stat as IKPICardProps)} />
            <Alert
              key={stat.message}
              sx={{ alignItems: "flex-start" }}
              variant="soft"
            >
              <div>
                <div style={{ fontWeight: 600 }}>Recomendación</div>
                <Typography level="body-sm">{stat.message}</Typography>
              </div>
            </Alert>
          </Stack>
        ))}
      </Box>
      <Typography level="h4" component="h1">
        Otras recomendaciones
      </Typography>
      <DataTable columns={columns} tableActions={[]} data={data} />
      <Typography level="h4" component="h1">
        Recomendaciones por categoría
      </Typography>
      <DataTable
        tableActions={[]}
        columns={columnsCategoria}
        data={recommendation.data?.recomendacionGastosPorCategoria ?? []}
      />
    </>
  );
};

export default StatePage;
