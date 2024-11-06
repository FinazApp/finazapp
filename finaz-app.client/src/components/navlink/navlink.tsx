import React from "react";
import { Icon } from "@tabler/icons-react";
import { NavLink as NavLinkRRD } from "react-router-dom";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";

export interface INavLinkProps {
  to: string;
  title: string;
  icon: Icon;
}

const NavLink = ({ title, icon: IconLink, to }: INavLinkProps) => {
  return (
    <NavLinkRRD to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <ListItem>
          <ListItemButton selected={isActive}>
            <IconLink size="22" style={{ width: 22, height: 22 }} />
            <ListItemContent>
              <Typography level="title-sm">{title}</Typography>
            </ListItemContent>
          </ListItemButton>
        </ListItem>
      )}
    </NavLinkRRD>
  );
};

export default NavLink;
