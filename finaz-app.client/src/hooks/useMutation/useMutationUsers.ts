import { Tags } from "@core";
import { UsersApi } from "@api";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: UsersApi.update,
    mutationKey: [Tags.USERS, Tags.MUTATION_UPDATE],
  });
};