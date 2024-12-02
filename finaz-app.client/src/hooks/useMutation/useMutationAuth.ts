import { Tags } from "@core";
import { AuthApi } from "@api";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: AuthApi.register,
    mutationKey: [Tags.REGISTER_USER, Tags.MUTATION_CREATE],
  });
};


export const useLogin = () => {
  return useMutation({
    mutationFn: AuthApi.login,
    mutationKey: [Tags.LOGIN_USER, Tags.MUTATION_UPDATE],
  });
};


export const useLogout = () => {
  return useMutation({
    mutationFn: AuthApi.logout,
    mutationKey: [Tags.LOGOUT_USER, Tags.MUTATION_UPDATE],
  });
};

