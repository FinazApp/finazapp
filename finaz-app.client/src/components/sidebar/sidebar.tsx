import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import Menu from "@mui/joy/Menu";
import Sheet from "@mui/joy/Sheet";
import Avatar from "@mui/joy/Avatar";
import Divider from "@mui/joy/Divider";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import GlobalStyles from "@mui/joy/GlobalStyles";
import { listItemButtonClasses } from "@mui/joy/ListItemButton";
import { SidebarUtils } from "@utils";
import {
  IconCategory,
  IconCurrencyDollar,
  IconHome2,
  IconDotsVertical,
  IconPigMoney,
  IconUsers,
  IconCash,
  IconFlag,
} from "@tabler/icons-react";
import { useAuth } from "@contexts";

import { NavLink } from "../navlink";
import { ColorSchemeToggle } from "../color-scheme-toggle";
import { ProfileFormModal } from "../profile-form-modal";
import { Reducers } from "@core";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const [state, dispatch] = React.useReducer(Reducers.DrawersReducer, {
    id: 0,
    open: false,
  });

  return (
    <>
      <Sheet
        className="Sidebar"
        sx={{
          position: { xs: "fixed", md: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
            md: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 50,
          height: "100dvh",
          width: "var(--Sidebar-width)",
          top: 0,
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <GlobalStyles
          styles={(theme) => ({
            ":root": {
              "--Sidebar-width": "220px",
              [theme.breakpoints.up("lg")]: {
                "--Sidebar-width": "240px",
              },
            },
          })}
        />
        <Box
          className="Sidebar-overlay"
          sx={{
            position: "fixed",
            zIndex: 9998,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: "var(--SideNavigation-slideIn)",
            backgroundColor: "var(--joy-palette-background-backdrop)",
            transition: "opacity 0.4s",
            transform: {
              xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
              lg: "translateX(-100%)",
            },
          }}
          onClick={() => SidebarUtils.closeSidebar()}
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton variant="soft" color="primary" size="sm">
            <IconCash />
          </IconButton>
          <Typography level="title-lg">FinazApp</Typography>
          <ColorSchemeToggle sx={{ ml: "auto" }} />
        </Box>
        <Box
          sx={{
            minHeight: 0,
            overflow: "hidden auto",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            [`& .${listItemButtonClasses.root}`]: {
              gap: 1.5,
            },
          }}
        >
          <List
            size="sm"
            sx={{
              gap: 1,
              "--List-nestedInsetStart": "30px",
              "--ListItem-radius": (theme) => theme.vars.radius.sm,
            }}
          >
            <NavLink to="/" title="Inicio" icon={IconHome2} />
            <NavLink to="/incomes" title="Ingresos" icon={IconPigMoney} />
            <NavLink to="/bills" title="Gastos" icon={IconCurrencyDollar} />
            <NavLink to="/savings" title="Metas de ahorros" icon={IconFlag} />
            <Divider />
            <NavLink to="/categories" title="Categorías" icon={IconCategory} />
            <NavLink to="/users" title="Usuarios" icon={IconUsers} />
          </List>
        </Box>
        <Divider />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Avatar
            variant="outlined"
            size="sm"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography level="title-sm">{user?.nombre ?? ""}</Typography>
            <Typography level="body-xs">
              {user?.correoElectronico ?? ""}
            </Typography>
          </Box>
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: "outlined", color: "neutral" } }}
            >
              <IconDotsVertical style={{ width: 18, height: 18 }} />
            </MenuButton>
            <Menu>
              <MenuItem
                onClick={() => {
                  dispatch({ type: "OPEN_DRAWER", payload: 0 });
                }}
              >
                Perfil
              </MenuItem>
              <MenuItem onClick={() => logout()}>Cerrar Sesión</MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      </Sheet>
      <ProfileFormModal
        open={state.open}
        onClose={() => dispatch({ type: "CLOSE_DRAWER" })}
      />
    </>
  );
};

export default Sidebar;
