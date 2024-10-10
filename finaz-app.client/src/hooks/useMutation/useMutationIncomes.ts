import { Tags } from "@core";
import { IncomesApi } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateIncomes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: IncomesApi.create,
    mutationKey: [Tags.INCOMES, Tags.MUTATION_CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.INCOMES] })
    }
  });
};

export const useUpdateIncomes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: IncomesApi.update,
    mutationKey: [Tags.INCOMES, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.INCOMES] })
    }
  });
};


