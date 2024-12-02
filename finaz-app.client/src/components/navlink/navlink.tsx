import React from "react";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import { NavLink as NavLinkRRD } from "react-router-dom";

export interface INavLinkProps {
  to: string;
  title: string;
  icon: React.ReactNode;
}

const NavLink = ({ title, icon, to }: INavLinkProps) => {
  return (
    <NavLinkRRD to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <ListItem>
          <ListItemButton selected={isActive}>
            {icon}
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
