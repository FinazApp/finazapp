import React from "react";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import toast from "react-hot-toast";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/joy/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import { createColumnHelper } from "@tanstack/react-table";

import { Reducers } from "@core";
import { ISavingGoal } from "@interfaces";
import {
  AddFondoFormModal,
  DataTable,
  ModalConfirm,
  SavingsFormModal,
} from "@components";
import { useDeleteSaving, useFetchSavings, useRestoreSaving } from "@hooks";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<ISavingGoal>();

const columns = [
  columnHelper.accessor("nombre", {
    id: "nombre",
    header: "Nombre",
    cell: (info) => <b>{info.getValue()}</b>,
  }),
  columnHelper.accessor("montoObjetivo", {
    id: "montoObjetivo",
    header: "Monto Objetivo",
    cell: (info) => (
      <span>
        {new Intl.NumberFormat("es-DO", {
          style: "currency",
          currency: "DOP",
        }).format(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("montoAhorrado", {
    id: "montoAhorrado",
    header: "Monto Ahorrado",
    cell: (info) => (
      <span>
        {new Intl.NumberFormat("es-DO", {
          style: "currency",
          currency: "DOP",
        }).format(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("fechaMeta", {
    id: "categoriaId",
    header: "Fecha final",
    cell: (info) => <span>{dayjs(info.getValue()).format("DD-MM-YYYY")}</span>,
  }),
  columnHelper.accessor("isDeleted", {
    id: "isDeleted",
    header: "Estado",
    cell: (info) => (
      <Chip
        size="sm"
        variant="solid"
        color={info.getValue() ? "danger" : "success"}
      >
        {info.getValue() ? "Eliminado" : "Activo"}
      </Chip>
    ),
  }),
];

const SavingsPage = () => {
  const savingsGoals = useFetchSavings();
  const deleteSaving = useDeleteSaving();
  const restoreSaving = useRestoreSaving();

  const [searchText, setSearchText] = React.useState("");
  const [type, setType] = React.useState<"restore" | "delete">("delete");
  const [saving, setSaving] = React.useState<ISavingGoal | null>(null);
  const [state, dispatch] = React.useReducer(Reducers.DrawersReducer, {
    id: 0,
    open: false,
  });
  const [stateFondo, dispatchFondo] = React.useReducer(
    Reducers.DrawersReducer,
    { id: 0, open: false }
  );

  const handleDelete = React.useCallback(() => {
    return toast.promise(
      deleteSaving.mutateAsync(saving?.metaId ?? 0, {
        onSuccess: () => setSaving(null),
      }),
      {
        error: (e) => e,
        loading: `Eliminando meta de ahorro ${saving?.nombre}...`,
        success: `Meta de ahorro ${saving?.nombre} eliminada correctamente.`,
      }
    );
  }, [saving?.metaId, saving?.nombre, deleteSaving]);

  const handleRestore = React.useCallback(() => {
    return toast.promise(
      restoreSaving.mutateAsync(saving?.metaId ?? 0, {
        onSuccess: () => setSaving(null),
      }),
      {
        error: (e) => e,
        loading: `Restaurando meta de ahorro ${saving?.nombre}...`,
        success: `Meta de ahorro ${saving?.nombre} restaurada correctamente.`,
      }
    );
  }, [saving?.metaId, saving?.nombre, restoreSaving]);

  const data = React.useMemo(() => {
    if (!savingsGoals.data?.length) return [];
    return savingsGoals.data.filter((saving) => {
      return (
        saving.montoAhorrado?.toString().includes(searchText) ||
        saving.montoObjetivo?.toString().includes(searchText) ||
        saving.nombre?.toLowerCase().includes(searchText?.toLowerCase())
      );
    });
  }, [savingsGoals.data, searchText]);

  return (
    <>
      <Box
        sx={{
          mb: 1,
          gap: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: { xs: "start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Typography level="h2" component="h1">
          Metas de ahorro
        </Typography>
        <Box
          sx={{
            gap: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: { xs: "start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            color="primary"
            startDecorator={<AddIcon />}
            onClick={() => dispatch({ type: "OPEN_DRAWER", payload: 0 })}
          >
            Agregar meta de ahorro
          </Button>
        </Box>
      </Box>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          display: "flex",
          pb: 1,
          flexDirection: { xs: "column", lg: "row" },
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <Input
            size="sm"
            placeholder="Búsqueda..."
            startDecorator={<SearchIcon />}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </FormControl>
      </Box>
      <DataTable<ISavingGoal>
        data={data ?? []}
        columns={columns}
        tableActions={(data) => [
          {
            title: "Agregar fondo",
            disabled: data.isDeleted,
            icon: <i className="ti ti-plus" style={{ fontSize: 20 }}></i>,
            onClick: () =>
              dispatchFondo({ type: "OPEN_DRAWER", payload: data.metaId }),
          },
          {
            title: "Editar",
            icon: <i className="ti ti-pencil" style={{ fontSize: 20 }}></i>,
            onClick: () =>
              dispatch({ type: "OPEN_DRAWER", payload: data.metaId }),
          },
          {
            color: "danger",
            icon: <i className="ti ti-trash" style={{ fontSize: 20 }}></i>,
            title: "Eliminar",
            disabled: data.isDeleted,
            onClick: () => {
              setType("delete");
              setSaving(data);
            },
          },
          {
            color: "success",
            icon: <i className="ti ti-plug" style={{ fontSize: 20 }}></i>,
            title: "Restaurar",
            disabled: !data.isDeleted,
            onClick: () => {
              setType("restore");
              setSaving(data);
            },
          },
        ]}
      />
      <SavingsFormModal
        id={state.id}
        open={state.open}
        onClose={() => dispatch({ type: "CLOSE_DRAWER" })}
      />
      <AddFondoFormModal
        id={stateFondo.id}
        open={stateFondo.open}
        onClose={() => dispatchFondo({ type: "CLOSE_DRAWER" })}
      />
      <ModalConfirm
        type={type}
        open={!!saving}
        onConfirm={type === "delete" ? handleDelete : handleRestore}
        onClose={() => setSaving(null)}
        description={`"¿Deseas ${
          type === "delete" ? "eliminar" : "restaurar"
        } esta meta de ahorro?"`}
        title={`${
          type === "delete" ? "Eliminando" : "Restaurando"
        } meta de ahorro '${saving?.nombre ?? ""}'`}
      />
    </>
  );
};

export default SavingsPage;
