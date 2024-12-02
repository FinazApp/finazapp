import { Tags } from "@core";
import { DashboardApi } from "@api";
import { useMutation } from "@tanstack/react-query";

export const useDashboardGenerateReport = (startDate: string, endDate: string) => {
  return useMutation({
    mutationKey: [Tags.DASHBOARD_SUMMARY, startDate, endDate, Tags.MUTATION_UPDATE],
    mutationFn: DashboardApi.generateReport
  });
};
