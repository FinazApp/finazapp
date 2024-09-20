import React from "react";
import { Button } from "../park-ui";

export interface INavLinkProps {
  title: string;
  icon: React.ReactNode;
}

const NavLink = ({ title, icon }: INavLinkProps) => {
  return (
    <Button
      gap="2"
      borderRadius="md"
      _hover={{
        bg: "red",
      }}
      justifyContent="start"
    >
      {icon}
      {title}
    </Button>
  );
};

export default NavLink;
