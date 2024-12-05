import { Tags } from "@core";
import { UsersApi } from "@api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersApi.update,
    mutationKey: [Tags.USERS, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.USERS] })
    }
  });
};

export const useChangeRoleUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersApi.changeRole,
    mutationKey: [Tags.USER_CHANGE_ROLE, Tags.MUTATION_UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.USERS] })
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersApi.delete,
    mutationKey: [Tags.USERS, Tags.MUTATION_DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Tags.USERS] })
    }
  });
};