import { Tags } from "@core";
import { UsersApi } from "@api";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserMe = () => {
  return useQuery({
    retry: 1,
    queryFn: UsersApi.me,
    queryKey: [Tags.USER_ME],
  });
};

export const useFetchUsers = () => {
  return useQuery({
    queryFn: UsersApi.getAll,
    queryKey: [Tags.USERS],
  });
};