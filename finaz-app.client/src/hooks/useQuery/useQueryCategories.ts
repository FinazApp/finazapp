import { useQuery } from "@tanstack/react-query";

import { Tags } from "@core";
import { CategoriesApi } from "@api";

export const useFetchCategories = () => {
  return useQuery({
    queryFn: CategoriesApi.getAll,
    queryKey: [Tags.CATEGORIES],
  });
};