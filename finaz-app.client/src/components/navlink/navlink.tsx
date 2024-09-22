import React from "react";
import { Button } from "../park-ui";

export interface INavLinkProps {
  title: string;
  isActive?: boolean;
  icon: React.ReactNode;
}

const NavLink = ({ title, icon, isActive }: INavLinkProps) => {
  return (
    <Button
      gap="2"
      variant="subtle"
      borderRadius="md"
      justifyContent="start"
      _hover={{
        colorPalette: "blue"
      }}
      colorPalette={isActive ? "blue": undefined} 
    >
      {icon}
      {title}
    </Button>
  );
};

export default NavLink;
