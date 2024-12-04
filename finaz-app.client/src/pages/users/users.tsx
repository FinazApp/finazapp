import React from "react";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import toast from "react-hot-toast";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import { createColumnHelper } from "@tanstack/react-table";

import { Reducers } from "@core";
import { IUser } from "@interfaces";
import { useAuth } from "@contexts";
import { useChangeRoleUser, useFetchUsers } from "@hooks";
import { DataTable, ModalConfirm, SavingsFormModal } from "@components";

const columnHelper = createColumnHelper<IUser>();

const columns = [
  columnHelper.accessor("nombre", {
    id: "nombre",
    header: "Usuario",
    cell: (info) => {
      const fotoPerfil = info.row.original.fotoPerfil;

      return (
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar
            size="md"
            variant="outlined"
            alt="FotoPerfilUsuario"
            src={
              fotoPerfil ??
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
            }
          />
          <Typography level="title-sm">{info.getValue()}</Typography>
        </Stack>
      );
    },
  }),
  columnHelper.accessor("correoElectronico", {
    id: "correoElectronico",
    header: "Correo Electrónico",
  }),
  columnHelper.accessor("rol", {
    id: "rol",
    header: "Rol",
    cell: (info) => (info.getValue() === "admin" ? "Administrador" : "Usuario"),
  }),
];

const UsersPage = () => {
  const { user } = useAuth();

  const users = useFetchUsers();
  const changeRole = useChangeRoleUser();

  const [searchText, setSearchText] = React.useState("");
  const [userSelected, setUserSelected] = React.useState<IUser | null>(null);
  const [type, setType] = React.useState<"promote" | "degrade">("degrade");
  const [state, dispatch] = React.useReducer(Reducers.DrawersReducer, {
    id: 0,
    open: false,
  });

  const handlePromote = React.useCallback(() => {
    return toast.promise(
      changeRole.mutateAsync(
        { action: "Promote", usuarioId: userSelected?.usuarioId ?? 0 },
        { onSuccess: () => setUserSelected(null) }
      ),
      {
        error: (e) => e,
        loading: `Promoviendo usuario ${userSelected?.nombre}...`,
        success: `Usuario ${userSelected?.nombre} promovido correctamente.`,
      }
    );
  }, [changeRole, userSelected?.usuarioId, userSelected?.nombre]);

  const handleDegrade = React.useCallback(() => {
    return toast.promise(
      changeRole.mutateAsync(
        { action: "Degrade", usuarioId: userSelected?.usuarioId ?? 0 },
        { onSuccess: () => setUserSelected(null) }
      ),
      {
        error: (e) => e,
        loading: `Degradando usuario ${userSelected?.nombre}...`,
        success: `Usuario ${userSelected?.nombre} degradado correctamente.`,
      }
    );
  }, [changeRole, userSelected?.usuarioId, userSelected?.nombre]);

  const data = React.useMemo(() => {
    if (!users.data?.length) return [];
    return users.data.filter((user) => {
      return (
        user.correoElectronico?.toString().includes(searchText) ||
        user.nombre?.toString().includes(searchText) ||
        user.rol?.toLowerCase().includes(searchText?.toLowerCase())
      );
    });
  }, [users.data, searchText]);

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
          Usuarios
        </Typography>
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
      <DataTable<IUser>
        data={data ?? []}
        columns={columns}
        tableActions={(data) => [
          {
            title: "Degradar a usuario",
            disabled: data.rol === "User" || user?.usuarioId === data.usuarioId,
            icon: <i className="ti ti-user-down" style={{ fontSize: 20 }}></i>,
            onClick: () => {
              setType("degrade");
              setUserSelected(data);
            },
          },
          {
            disabled:
              data.rol === "admin" || user?.usuarioId === data.usuarioId,
            title: "Promover a administrador",
            icon: <i className="ti ti-user-up" style={{ fontSize: 20 }}></i>,
            onClick: () => {
              setType("promote");
              setUserSelected(data);
            },
          },
        ]}
      />
      <SavingsFormModal
        id={state.id}
        open={state.open}
        onClose={() => dispatch({ type: "CLOSE_DRAWER" })}
      />
      <ModalConfirm
        type={type === "promote" ? "restore" : "delete"}
        open={!!userSelected}
        restoreIcon="ti ti-user-up"
        deleteIcon="ti ti-user-down"
        onConfirm={type === "promote" ? handlePromote : handleDegrade}
        onClose={() => setUserSelected(null)}
        description={`"¿Deseas ${
          type === "degrade" ? "degradar" : "promover"
        } este usuario?"`}
        title={`${
          type === "degrade" ? "Degradando" : "Promoviendo"
        } este usuario '${userSelected?.nombre ?? ""}'`}
      />
    </>
  );
};

export default UsersPage;
