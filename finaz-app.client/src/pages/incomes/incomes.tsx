import React from "react";
import { IIncomes } from "@interfaces";
import { Box } from "styled-system/jsx";
import { FormatNumber } from "@ark-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";

import { Reducers } from "@core";
import { useFetchIncomes } from "@hooks";
import { Button, DataTable, Header, IncomeFormDrawer } from "@components";

const columnHelper = createColumnHelper<IIncomes>();

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

const IncomesPage = () => {
  const incomes = useFetchIncomes();

  const [state, dispatch] = React.useReducer(Reducers.DrawersReducer, {
    id: 0,
    open: false,
  });

  return (
    <>
      <Header
        title="Ingresos"
        subtitle="{{breadcrumb}}"
        rightContent={
          <Button
            variant="subtle"
            colorPalette="accent"
            onClick={() => dispatch({ type: "OPEN_DRAWER", payload: 0 })}
          >
            <IconPlus size="22" style={{ height: 22, width: 22 }} />
            Crear nuevo ingreso
          </Button>
        }
      />
      <Box bg="Background" borderRadius="lg" boxShadow="lg">
        <DataTable<IIncomes>
          data={incomes.data ?? []}
          columns={columns}
          tableActions={(data) => [
            {
              title: "Editar",
              icon: IconPencil,
              onClick: () =>
                dispatch({ type: "OPEN_DRAWER", payload: data.ingresosId }),
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
      <IncomeFormDrawer
        id={state.id}
        open={state.open}
        onOpenChange={() => dispatch({ type: "CLOSE_DRAWER" })}
      />
    </>
  );
};

export default IncomesPage;
