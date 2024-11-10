import React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { IKPICardProps, KPICard } from "@components";

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
            Download PDF
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {stats.map((stat) => (
          <KPICard {...stat} />
        ))}
      </Box>
    </>
  );
};

export default DashboardPage;
