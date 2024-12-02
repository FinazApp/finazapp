import React from "react";
import Box from "@mui/joy/Box";
import Menu from "@mui/joy/Menu";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { isFunction } from "radash";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  AccessorKeyColumnDef,
} from "@tanstack/react-table";

import { ActionMenu } from "@interfaces";

export interface IDataTableProps<T extends object> {
  data: T[];
  pageSizes?: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: AccessorKeyColumnDef<T, any>[];
  tableActions?: ((data: T) => ActionMenu[]) | ActionMenu[];
}

const DataTable = <T extends object>({
  data,
  columns,
  pageSizes = [10, 20, 30, 40, 50],
  tableActions,
}: IDataTableProps<T>) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable<T>({
    data,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  const actions = React.useCallback(
    (data: T) => (isFunction(tableActions) ? tableActions(data) : tableActions),
    [tableActions]
  );

  return (
    <>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          borderAxis="bothBetween"
          aria-labelledby="tableTitle"
          stickyHeader
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {/* <th
                  style={{
                    width: 48,
                    textAlign: "center",
                    padding: "12px 6px",
                  }}
                >
                  <Checkbox
                    size="sm"
                    indeterminate={
                      selected.length > 0 && selected.length !== rows.length
                    }
                    checked={selected.length === rows.length}
                    onChange={(event) => {
                      setSelected(
                        event.target.checked ? rows.map((row) => row.id) : []
                      );
                    }}
                    color={
                      selected.length > 0 || selected.length === rows.length
                        ? "primary"
                        : undefined
                    }
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </th> */}
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ padding: "12px 6px" }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
                {!!actions({} as never)?.length && (
                  <th style={{ width: 50, padding: "12px 6px" }}>
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                      <i className="ti ti-click" style={{ fontSize: 20 }}></i>
                    </Box>
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {/* <td style={{ textAlign: "center", width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? "primary" : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id)
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </td> */}
                {!!actions(row.original)?.length && (
                  <td>
                    <Dropdown>
                      <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: {
                            variant: "plain",
                            color: "neutral",
                            size: "sm",
                          },
                        }}
                      >
                        <i className="ti ti-dots-vertical" style={{ fontSize: 20 }}></i>
                      </MenuButton>
                      <Menu size="sm" sx={{ minWidth: 140 }}>
                        {actions(row.original)?.map(
                          ({
                            icon,
                            onClick,
                            color,
                            divider,
                            disabled,
                            title,
                          }) => {
                            if (disabled)
                              return (
                                <React.Fragment key={title}></React.Fragment>
                              );
                            if (divider) return <Divider key={title} />;
                            return (
                              <MenuItem
                                key={title}
                                color={color as never}
                                onClick={onClick}
                              >
                                {icon}
                                {title}
                              </MenuItem>
                            );
                          }
                        )}
                      </Menu>
                    </Dropdown>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 1,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Box sx={{ flex: 1 }} />
        {[...Array(table.getPageCount()).keys()].map((pageNum) => (
          <IconButton
            size="sm"
            key={pageNum}
            color="neutral"
            onClick={() => table.setPageIndex(pageNum)}
            variant={pagination.pageIndex === pageNum ? "outlined" : "plain"}
          >
            {pageNum + 1}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
        <Select<number>
          size="sm"
          value={table.getState().pagination.pageSize}
          onChange={(_, value) => table.setPageSize(value ?? 0)}
        >
          {pageSizes.map((pageSize) => (
            <Option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </Option>
          ))}
        </Select>
      </Box>
    </>
  );
};

export default DataTable;
