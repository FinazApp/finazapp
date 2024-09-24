import React from "react";
import { faker } from "@faker-js/faker";
import { Box } from "styled-system/jsx";
import { FormatNumber } from "@ark-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";

import { Button, DataTable, Header, BillFormDrawer } from "@components";

type Product = { id: number; price: number; name: string; category: string };

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

const BillsPage = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <Header
        title="Gastos"
        subtitle="{{breadcrumb}}"
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
        <DataTable<Product>
          data={products}
          columns={columns}
          tableActions={[
            {
              title: "Editar",
              icon: IconPencil,
              onClick: () => {},
            },
            {
              icon: IconTrash,
              title: "Eliminar",
              onClick: () => {},
              colorPalette: "red",
            },
          ]}
        />
      </Box>
      <BillFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
};

export default BillsPage;
