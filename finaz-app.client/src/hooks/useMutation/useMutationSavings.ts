import { Tags } from "@core";
import { SavingsApi } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateSaving = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SavingsApi.create,
    mutationKey: [Tags.SAVINGS, Tags.MUTATION_CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.SAVINGS] })
    }
  });
};

export const useUpdateSaving = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SavingsApi.update,
    mutationKey: [Tags.SAVINGS, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.SAVINGS] })
    }
  });
};

export const useDeleteSaving = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SavingsApi.delete,
    mutationKey: [Tags.SAVINGS, Tags.MUTATION_DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.SAVINGS] })
    }
  });
};

export const useRestoreSaving = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SavingsApi.restore,
    mutationKey: [Tags.SAVINGS, Tags.MUTATION_RESTORE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.SAVINGS] })
    }
  });
};

export const useAddFondoSaving = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SavingsApi.addFondo,
    mutationKey: [Tags.SAVINGS_FONDO, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.SAVINGS] })
    }
  });
};