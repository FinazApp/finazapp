import { Tags } from "@core";
import { DashboardApi } from "@api";
import { useQuery } from "@tanstack/react-query";

export const useFetchDashboardSummary = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: [Tags.DASHBOARD_SUMMARY, startDate, endDate],
    queryFn: () => DashboardApi.summary(startDate, endDate),
  });
};

export const useFetchRecomendacion = () => {
  return useQuery({
    queryKey: [Tags.RECOMENDACIONES],
    queryFn: DashboardApi.recomendaciones
  });
};