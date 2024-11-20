import React from "react";
import millify from "millify";
import SvgIcon from "@mui/joy/SvgIcon";
import Typography from "@mui/joy/Typography";
import CardContent from "@mui/joy/CardContent";
import Card, { CardProps } from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export interface IKPICardProps {
  title: string;
  value: number;
  color: CardProps["color"];
  data: {
    percent: number;
    type: "down" | "up";
  };
}

const KPICard = ({ title, value, data, color = "primary" }: IKPICardProps) => {
  return (
    <Card variant="soft" color={color} sx={{ width: "100%" }} invertedColors>
      <CardContent orientation="horizontal">
        <CircularProgress size="lg" determinate value={data.percent}>
          <SvgIcon>
            {data.type === "down" ? <IconTrendingDown /> : <IconTrendingUp />}
          </SvgIcon>
        </CircularProgress>
        <CardContent>
          <Typography level="body-md">{title}</Typography>
          <Typography level="h2">{millify(value, { precision: 2 })}</Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default KPICard;
