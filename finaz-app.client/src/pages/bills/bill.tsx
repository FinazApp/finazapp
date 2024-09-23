import React from "react";
import { IconClick, IconPlus } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Flex } from "styled-system/jsx";
import { Button, DataTable, Header, BillFormDrawer } from "@components";
import { faker } from "@faker-js/faker";
import { FormatNumber } from "@ark-ui/react";

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
  columnHelper.accessor("id", {
    id: "id",
    header: () => <IconClick size="20" style={{ height: 20, width: 20 }} />,
    cell: () => (
      <Flex gap="2" justifyContent="center">
        <Button size="xs" variant="ghost" colorPalette="accent">
          Editar
        </Button>
        <Button size="xs" variant="ghost" colorPalette="red">
          Eliminar
        </Button>
      </Flex>
    ),
  }),
];

const BillPage = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <Header
        title="Gastos"
        subtitle="Listado de"
        rightContent={
          <Button
            variant="subtle"
            colorPalette="accent"
            onClick={() => setDrawerOpen(true)}
          >
            <IconPlus size="22" style={{ height: 22, width: 22 }} />
            Crear nuevo gasto
          </Button>
        }
      />
      <Box bg="Background" borderRadius="lg" boxShadow="lg">
        <DataTable<Product> data={products} columns={columns} />
      </Box>
      <BillFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
};

export default BillPage;
