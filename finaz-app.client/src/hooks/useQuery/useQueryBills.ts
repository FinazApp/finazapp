import { Tags } from "@core";
import { BillsApi } from "@api";
import { useQuery } from "@tanstack/react-query";

export const useFetchBills = () => {
  return useQuery({
    queryFn: BillsApi.getAll,
    queryKey: [Tags.BILLS],
  });
};

export const useFetchOneBills = (id: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: [Tags.BILLS, id],
    queryFn: () => BillsApi.getById(id),
  });
};