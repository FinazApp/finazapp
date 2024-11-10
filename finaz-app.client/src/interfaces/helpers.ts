import { Icon } from "@tabler/icons-react";

type ActionWithoutDivider = {
    icon: Icon;
    title: string;
    color?: string;
    divider?: false;
    disabled?: boolean;
    onClick?: () => void;
};

type ActionWithDivider = {
    icon?: never;
    title?: never;
    divider: true;
    color?: never;
    onClick?: never;
    disabled?: never;
};

export type ActionMenu = ActionWithoutDivider | ActionWithDivider