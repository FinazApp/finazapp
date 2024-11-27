import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import Menu from "@mui/joy/Menu";
import Input from "@mui/joy/Input";
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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import { SidebarUtils } from "@utils";
import {
  IconCategory,
  IconCurrencyDollar,
  IconHome2,
  IconDotsVertical,
  IconPigMoney,
} from "@tabler/icons-react";
import { useAuth } from "@contexts";

import { NavLink } from "../navlink";
import { ColorSchemeToggle } from "../color-scheme-toggle";

const Sidebar = () => {
  const { user } = useAuth();
  console.log("🚀 ~ Sidebar ~ user:", user);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        // zIndex: 1200,
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
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">FinazApp</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Busqueda..."
      />
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
          <NavLink to="/categories" title="Categorías" icon={IconCategory} />
          <NavLink to="/incomes" title="Ingresos" icon={IconPigMoney} />
          <NavLink to="/bills" title="Gastos" icon={IconCurrencyDollar} />
          {/* <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <GroupRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Users</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={[
                      open
                        ? {
                            transform: "rotate(180deg)",
                          }
                        : {
                            transform: "none",
                          },
                    ]}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    role="menuitem"
                    component="a"
                    href="/joy-ui/getting-started/templates/profile-dashboard/"
                  >
                    My profile
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>Create a new user</ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>Roles & permission</ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem> */}
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
            <IconDotsVertical style={{ width: 20, height: 20 }} />
          </MenuButton>
          <Menu>
            <MenuItem>Perfil</MenuItem>
            <MenuItem>Cerrar Sesión</MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Sheet>
  );
};

export default Sidebar;
