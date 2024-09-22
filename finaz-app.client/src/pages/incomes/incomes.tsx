import React from "react";
import { faker } from "@faker-js/faker";
import { Box } from "styled-system/jsx";
import { FormatNumber } from "@ark-ui/react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable, Header } from "@components";

type Product = {
  id: number;
  price: number;
  name: string;
  category: string;
};

const products: Product[] = Array.from({ length: 50 }, (_, index) => {
  return {
    id: index,
    price: parseInt(faker.commerce.price(), 10),
    name: faker.commerce.product(),
    category: faker.helpers.arrayElement(["Hogar", "Vehículo", "Supermercado"]),
  };
});

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("name", {
    id: "name",
    header: "Nombre",
    cell: (info) => <b>{info.getValue()}</b>,
  }),
  columnHelper.accessor("category", {
    id: "category",
    header: "Categoría",
  }),
  columnHelper.accessor("price", {
    id: "price",
    header: "Precio",
    cell: (info) => (
      <FormatNumber
        style="currency"
        currency="USD"
        value={info.getValue() ?? 0}
      />
    ),
  }),
];

const IncomesPage = () => {
  return (
    <>
      <Header title="Ingresos" subtitle="Listado de" />
      <Box bg="Background" borderRadius="lg" boxShadow="lg">
        <DataTable<Product> data={products} columns={columns} />
      </Box>
    </>
  );
};

export default IncomesPage;
