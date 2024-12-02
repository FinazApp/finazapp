import React from "react";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/joy/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import { createColumnHelper } from "@tanstack/react-table";
import { IconPencil, IconTrash, IconPlug } from "@tabler/icons-react";

import { Reducers } from "@core";
import { IIncome } from "@interfaces";
import { DataTable, IncomeFormModal, ModalConfirm } from "@components";
import {
  useDeleteIncome,
  useFetchIncomes,
  useRestoreIncome,
  useFetchCategories,
} from "@hooks";

const columnHelper = createColumnHelper<IIncome>();

const columns = [
  columnHelper.accessor("nombre", {
    id: "nombre",
    header: "Nombre",
    cell: (info) => <b>{info.getValue()}</b>,
  }),
  columnHelper.accessor("monto", {
    id: "monto",
    header: "Monto",
    cell: (info) => (
      <span>
        {new Intl.NumberFormat("es-DO", {
          style: "currency",
          currency: "DOP",
        }).format(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("categoria.nombre", {
    id: "categoriaId",
    header: "Categoría",
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

const IncomesPage = () => {
  const incomes = useFetchIncomes();
  const deleteIncome = useDeleteIncome();
  const categories = useFetchCategories();
  const restoreIncome = useRestoreIncome();

  const [categoryId, setCategoryId] = React.useState(0);
  const [searchText, setSearchText] = React.useState("");
  const [type, setType] = React.useState<"restore" | "delete">("delete");
  const [income, setIncome] = React.useState<IIncome | null>(null);
  const [state, dispatch] = React.useReducer(Reducers.DrawersReducer, {
    id: 0,
    open: false,
  });

  const handleDelete = React.useCallback(() => {
    return toast.promise(
      deleteIncome.mutateAsync(income?.ingresoId ?? 0, {
        onSuccess: () => setIncome(null),
      }),
      {
        error: (e) => e,
        loading: `Eliminando ingreso ${income?.nombre}...`,
        success: `Ingreso ${income?.nombre} eliminado correctamente.`,
      }
    );
  }, [income?.ingresoId, income?.nombre, deleteIncome]);

  const handleRestore = React.useCallback(() => {
    return toast.promise(
      restoreIncome.mutateAsync(income?.ingresoId ?? 0, {
        onSuccess: () => setIncome(null),
      }),
      {
        error: (e) => e,
        loading: `Restaurando ingreso ${income?.nombre}...`,
        success: `Ingreso ${income?.nombre} restaurado correctamente.`,
      }
    );
  }, [income?.ingresoId, income?.nombre, restoreIncome]);

  const categoriesOptions = React.useMemo(() => {
    if (!categories.data?.length) return [];
    return categories.data.map((category) => ({
      label: category.nombre,
      value: category.categoriaId,
      disabled: category.isDeleted,
    }));
  }, [categories.data]);

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <Select<number>
          size="sm"
          value={categoryId}
          placeholder="Filtrar por categoría"
          onChange={(_, value) => setCategoryId(value ?? 0)}
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
        >
          <Option value="">Filtrar por categoría</Option>
          {categoriesOptions.map((item) => (
            <Option
              key={item.label}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </Option>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );

  const data = React.useMemo(() => {
    if (!incomes.data?.length) return [];
    return incomes.data
      .filter((category) => {
        return (
          category.monto?.toString().includes(searchText) ||
          category.nombre?.toLowerCase().includes(searchText?.toLowerCase())
        );
      })
      .filter((bill) => (categoryId ? bill.categoriaId === categoryId : true));
  }, [categoryId, incomes.data, searchText]);

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
          Ingresos
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
            Agregar nuevo ingreso
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
        {renderFilters()}
      </Box>
      <DataTable<IIncome>
        data={data ?? []}
        columns={columns}
        tableActions={(data) => [
          {
            title: "Editar",
            icon: IconPencil,
            onClick: () =>
              dispatch({ type: "OPEN_DRAWER", payload: data.ingresoId }),
          },
          {
            color: "danger",
            icon: IconTrash,
            title: "Eliminar",
            disabled: data.isDeleted,
            onClick: () => {
              setType("delete");
              setIncome(data);
            },
          },
          {
            color: "success",
            icon: IconPlug,
            title: "Restaurar",
            disabled: !data.isDeleted,
            onClick: () => {
              setType("restore");
              setIncome(data);
            },
          },
        ]}
      />
      <IncomeFormModal
        id={state.id}
        open={state.open}
        onClose={() => dispatch({ type: "CLOSE_DRAWER" })}
      />
      <ModalConfirm
        type={type}
        open={!!income}
        onConfirm={type === "delete" ? handleDelete : handleRestore}
        onClose={() => setIncome(null)}
        description={`"¿Deseas ${
          type === "delete" ? "eliminar" : "restaurar"
        } este ingreso?"`}
        title={`${type === "delete" ? "Eliminando" : "Restaurando"} ingreso '${
          income?.nombre ?? ""
        }'`}
      />
    </>
  );
};

export default IncomesPage;
