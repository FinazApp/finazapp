import { Tags } from "@core";
import { CategoriesApi } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesApi.create,
    mutationKey: [Tags.CATEGORIES, Tags.MUTATION_CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.CATEGORIES] })
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesApi.update,
    mutationKey: [Tags.CATEGORIES, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.CATEGORIES] })
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesApi.delete,
    mutationKey: [Tags.CATEGORIES, Tags.MUTATION_DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.CATEGORIES] })
    }
  });
};

export const useRestoreCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesApi.restore,
    mutationKey: [Tags.CATEGORIES, Tags.MUTATION_RESTORE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.CATEGORIES] })
    }
  });
};


