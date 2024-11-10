import { Tags } from "@core";
import { IncomesApi } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateIncome = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: IncomesApi.create,
    mutationKey: [Tags.INCOMES, Tags.MUTATION_CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.INCOMES] })
    }
  });
};

export const useUpdateIncome = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: IncomesApi.update,
    mutationKey: [Tags.INCOMES, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.INCOMES] })
    }
  });
};

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: IncomesApi.delete,
    mutationKey: [Tags.INCOMES, Tags.MUTATION_DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.INCOMES] })
    }
  });
};

export const useRestoreIncome = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: IncomesApi.restore,
    mutationKey: [Tags.INCOMES, Tags.MUTATION_RESTORE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.INCOMES] })
    }
  });
};


