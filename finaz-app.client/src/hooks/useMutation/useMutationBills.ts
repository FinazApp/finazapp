import { Tags } from "@core";
import { BillsApi } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BillsApi.create,
    mutationKey: [Tags.BILLS, Tags.MUTATION_CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.BILLS] })
    }
  });
};

export const useUpdateBills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BillsApi.update,
    mutationKey: [Tags.BILLS, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.BILLS] })
    }
  });
};

export const useDeleteBills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BillsApi.delete,
    mutationKey: [Tags.BILLS, Tags.MUTATION_DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.BILLS] })
    }
  });
};
