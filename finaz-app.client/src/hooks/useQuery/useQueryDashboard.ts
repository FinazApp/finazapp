import { Tags } from "@core";
import { DashboardApi } from "@api";
import { useQuery } from "@tanstack/react-query";

export const useFetchDashboardBalance = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: [Tags.PANEL_ADMIN_BALANCE, startDate, endDate],
    queryFn: () => DashboardApi.balance(startDate, endDate),
  });
};