import React from "react";
import { PercentageKpi } from "@interfaces";
import Typography from "@mui/joy/Typography";
import CardContent from "@mui/joy/CardContent";
import Card, { CardProps } from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";

export interface IKPICardProps {
  title: string;
  value: number;
  data?: PercentageKpi;
  color: CardProps["color"];
}

const KPICard = ({ title, value, data, color = "primary" }: IKPICardProps) => {
  return (
    <Card variant="soft" color={color} sx={{ width: "100%" }} invertedColors>
      <CardContent orientation="horizontal">
        <CircularProgress size="lg" determinate value={data?.porcentaje ?? 0}>
          {data?.tipo === "Negativo" ? (
            <i className="ti ti-trending-down" style={{ fontSize: 24 }}></i>
          ) : (
            <i className="ti ti-trending-up" style={{ fontSize: 24 }}></i>
          )}
        </CircularProgress>
        <CardContent>
          <Typography level="body-md">{title}</Typography>
          <Typography level="h2">
            {new Intl.NumberFormat("es-DO", {
              style: "currency",
              currency: "DOP",
            }).format(value)}
          </Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default KPICard;
