import React from "react";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/joy/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import { createColumnHelper } from "@tanstack/react-table";
import { IconPlug, IconTrash, IconPencil } from "@tabler/icons-react";

import { Reducers } from "@core";
import { ICategory } from "@interfaces";
import { CategoryFormModal, DataTable, ModalConfirm } from "@components";
import {
  useDeleteCategory,
  useFetchCategories,
  useRestoreCategory,
} from "@hooks";

const columnHelper = createColumnHelper<ICategory>();

const columns = [
  columnHelper.accessor("nombre", {
    id: "nombre",
    header: "Nombre",
    cell: (info) => <b>{info.getValue()}</b>,
  }),
  columnHelper.accessor("descripcion", {
    id: "descripcion",
    header: "Descripción",
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

const CategoriesPage = () => {
  const categories = useFetchCategories();
  const deleteCategory = useDeleteCategory();
  const restoreCategory = useRestoreCategory();

  const [searchText, setSearchText] = React.useState("");
  const [type, setType] = React.useState<"restore" | "delete">("delete");
  const [category, setCategory] = React.useState<ICategory | null>(null);
  const [state, dispatch] = React.useReducer(Reducers.DrawersReducer, {
    id: 0,
    open: false,
  });

  const handleDeleteCategory = React.useCallback(() => {
    return toast.promise(
      deleteCategory.mutateAsync(category?.categoriaId ?? 0, {
        onSuccess: () => {
          setCategory(null);
        },
      }),
      {
        error: (e) => e,
        loading: `Eliminando categoría ${category?.nombre}...`,
        success: `Categoría ${category?.nombre} eliminada correctamente.`,
      }
    );
  }, [category?.categoriaId, category?.nombre, deleteCategory]);

  const handleRestoreCategory = React.useCallback(() => {
    return toast.promise(
      restoreCategory.mutateAsync(category?.categoriaId ?? 0, {
        onSuccess: () => {
          setCategory(null);
        },
      }),
      {
        error: (e) => e,
        loading: `Restaurando categoría ${category?.nombre}...`,
        success: `Categoría ${category?.nombre} restaurada correctamente.`,
      }
    );
  }, [category?.categoriaId, category?.nombre, restoreCategory]);

  const data = React.useMemo(() => {
    if (!categories.data?.length) return [];
    return categories.data.filter((category) => {
      return (
        category.descripcion?.toString().includes(searchText) ||
        category.nombre?.toLowerCase().includes(searchText?.toLowerCase())
      );
    });
  }, [categories.data, searchText]);

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
          Categorías
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
            Crear nueva categoría
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
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Búsqueda..."
            startDecorator={<SearchIcon />}
          />
        </FormControl>
      </Box>
      <DataTable<ICategory>
        data={data ?? []}
        columns={columns}
        tableActions={(data) => [
          {
            title: "Editar",
            icon: IconPencil,
            onClick: () =>
              dispatch({ type: "OPEN_DRAWER", payload: data.categoriaId }),
          },
          {
            color: "danger",
            icon: IconTrash,
            title: "Eliminar",
            disabled: data.isDeleted,
            onClick: () => {
              setType("delete");
              setCategory(data);
            },
          },
          {
            color: "success",
            icon: IconPlug,
            title: "Restaurar",
            disabled: !data.isDeleted,
            onClick: () => {
              setType("restore");
              setCategory(data);
            },
          },
        ]}
      />
      <CategoryFormModal
        id={state.id}
        open={state.open}
        onClose={() => dispatch({ type: "CLOSE_DRAWER" })}
      />
      <ModalConfirm
        type={type}
        open={!!category}
        onConfirm={
          type === "delete" ? handleDeleteCategory : handleRestoreCategory
        }
        onClose={() => setCategory(null)}
        description={`"¿Deseas ${
          type === "delete" ? "eliminar" : "restaurar"
        } esta categoría?"`}
        title={`${
          type === "delete" ? "Eliminando" : "Restaurando"
        } categoría '${category?.nombre ?? ""}'`}
      />
    </>
  );
};

export default CategoriesPage;
