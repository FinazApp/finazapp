import React from "react";
import { Box } from "styled-system/jsx";
import { FormatNumber } from "@ark-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";

import { Reducers } from "@core";
import { IBills } from "@interfaces";
import { useFetchBills } from "@hooks";
import { Button, DataTable, Header, BillFormDrawer } from "@components";

const columnHelper = createColumnHelper<IBills>();

const columns = [
  columnHelper.accessor("nombre", {
    id: "nombre",
    header: "Nombre",
    cell: (info) => <b>{info.getValue()}</b>,
  }),
  columnHelper.accessor("categoria.nombre", {
    id: "category",
    header: "Categoría",
  }),
  columnHelper.accessor("monto", {
    id: "amount",
    header: "Monto",
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
  const bills = useFetchBills();
  console.log("🚀 ~ BillsPage ~ bills:", bills)

  const [state, dispatch] = React.useReducer(Reducers.DrawersReducer, {
    id: 0,
    open: false,
  });

  return (
    <>
      <Header
        title="Gastos"
        subtitle="{{breadcrumb}}"
        rightContent={
          <Button
            variant="subtle"
            colorPalette="accent"
            onClick={() => dispatch({ type: "OPEN_DRAWER", payload: 0 })}
          >
            <IconPlus size="22" style={{ height: 22, width: 22 }} />
            Crear nuevo gasto
          </Button>
        }
      />
      <Box bg="Background" borderRadius="lg" boxShadow="lg">
        <DataTable<IBills>
          data={bills.data ?? []}
          columns={columns}
          tableActions={(data) => [
            {
              title: "Editar",
              icon: IconPencil,
              onClick: () =>
                dispatch({ type: "OPEN_DRAWER", payload: data.gastosId }),
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
      <BillFormDrawer
        id={state.id}
        open={state.open}
        onOpenChange={() => dispatch({ type: "CLOSE_DRAWER" })}
      />
    </>
  );
};

export default BillsPage;
