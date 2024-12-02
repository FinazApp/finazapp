import { Tags } from "@core";
import { UsersApi } from "@api";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserMe = () => {
  return useQuery({
    queryFn: UsersApi.me,
    queryKey: [Tags.USER_ME],
  });
};