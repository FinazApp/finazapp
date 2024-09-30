import { useMutation } from "@tanstack/react-query";

import { Tags } from "@core";
import { RegisterApi } from "@api";

export const useRegister = () => {
  return useMutation({
    mutationFn: RegisterApi.register,
    mutationKey: [Tags.REGISTER_USER, Tags.MUTATION_CREATE],
  });
};

