import { Tags } from "@core";
import { IncomesApi } from "@api";
import { useQuery } from "@tanstack/react-query";

export const useFetchIncomes = () => {
  return useQuery({
    queryFn: IncomesApi.getAll,
    queryKey: [Tags.INCOMES],
  });
};

export const useFetchOneIncomes = (id: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: [Tags.INCOMES, id],
    queryFn: () => IncomesApi.getById(id),
  });
};