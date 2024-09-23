import React from "react";
import { Icon } from "@tabler/icons-react";
import { NavLink as NavLinkRRD } from "react-router-dom";

import { Button } from "../park-ui";

export interface INavLinkProps {
  to: string;
  title: string;
  icon: Icon;
}

const NavLink = ({ title, icon: IconLink, to }: INavLinkProps) => {
  return (
    <NavLinkRRD to={to}>
      {({ isActive }) => (
        <Button
          gap="2"
          width="full"
          variant={isActive ? "solid" : "subtle"}
          justifyContent="start"
          _hover={{ colorPalette: "blue" }}
        >
          <IconLink size="22" style={{ width: 22, height: 22 }} />
          {title}
        </Button>
      )}
    </NavLinkRRD>
  );
};

export default NavLink;
