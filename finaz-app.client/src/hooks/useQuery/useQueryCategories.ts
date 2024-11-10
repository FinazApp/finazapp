import { useQuery } from "@tanstack/react-query";

import { Tags } from "@core";
import { CategoriesApi } from "@api";

export const useFetchCategories = () => {
  return useQuery({
    queryFn: CategoriesApi.getAll,
    queryKey: [Tags.CATEGORIES],
  });
};

export const useFetchOneCategory = (id: number) => {
  return useQuery({
    queryKey: [Tags.CATEGORIES, id],
    queryFn: () => CategoriesApi.getById(id),
    enabled: !!id,
  });
};