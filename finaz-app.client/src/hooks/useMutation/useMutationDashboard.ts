import { Tags } from "@core";
import { DashboardApi } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDashboardGenerateReport = (startDate: string, endDate: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [Tags.DASHBOARD_SUMMARY, startDate, endDate, Tags.MUTATION_UPDATE],
    mutationFn: DashboardApi.generateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.DASHBOARD_SUMMARY] })
    }
  });
};
