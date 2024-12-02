import { Tags } from "@core";
import { SavingsApi } from "@api";
import { useQuery } from "@tanstack/react-query";

export const useFetchSavings = () => {
  return useQuery({
    queryFn: SavingsApi.getAll,
    queryKey: [Tags.SAVINGS],
  });
};

export const useFetchOneSaving = (id: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: [Tags.SAVINGS, id],
    queryFn: () => SavingsApi.getById(id),
  });
};