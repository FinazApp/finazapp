import React from "react";
import { IconX } from "@tabler/icons-react";

import { Button, IconButton } from "../park-ui";
import { Drawer as ParkDrawer } from "../park-ui/drawer";

type DrawerRootProps = React.ComponentProps<typeof ParkDrawer.Root>;

export interface IDrawerProps extends DrawerRootProps {
  title: string;
  subtitle: string;
  submitText: string;
  cancelText?: string;
  cancelLoading?: boolean;
  submitLoading?: boolean;
}

const Drawer = ({
  title,
  subtitle,
  children,
  submitText,
  submitLoading,
  cancelLoading,
  cancelText = "Cancelar",
  ...props
}: React.PropsWithChildren<IDrawerProps>) => {
  return (
    <ParkDrawer.Root {...props}>
      <ParkDrawer.Backdrop />
      <ParkDrawer.Positioner>
        <ParkDrawer.Content>
          <ParkDrawer.Header>
            <ParkDrawer.Title>{title}</ParkDrawer.Title>
            <ParkDrawer.Description>{subtitle}</ParkDrawer.Description>
            <ParkDrawer.CloseTrigger
              asChild
              position="absolute"
              top="3"
              right="4"
            >
              <IconButton variant="ghost">
                <IconX />
              </IconButton>
            </ParkDrawer.CloseTrigger>
          </ParkDrawer.Header>
          <ParkDrawer.Body>{children}</ParkDrawer.Body>
          <ParkDrawer.Footer gap="3">
            <ParkDrawer.CloseTrigger asChild>
              <Button type="reset" loading={cancelLoading} variant="outline">
                {cancelText}
              </Button>
            </ParkDrawer.CloseTrigger>
            <Button type="submit" loading={submitLoading}>
              {submitText}
            </Button>
          </ParkDrawer.Footer>
        </ParkDrawer.Content>
      </ParkDrawer.Positioner>
    </ParkDrawer.Root>
  );
};

export default Drawer;
