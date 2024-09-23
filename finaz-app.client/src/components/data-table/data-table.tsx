import React from "react";
import { Flex } from "styled-system/jsx";

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

import { Pagination, Table, Text } from "@components";

export interface IDataTableProps<T extends object> {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: AccessorKeyColumnDef<T, any>[];
}

const DataTable = <T extends object>({ columns, data }: IDataTableProps<T>) => {
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

  return (
    <Table.Root variant="outline" size="sm">
      <Table.Head>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Header key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </Table.Header>
            ))}
          </Table.Row>
        ))}
      </Table.Head>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
      {/* <Table.Foot>
            {table.getFooterGroups().map((footerGroup) => (
              <Table.Row key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <Table.Cell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Foot> */}
      <Table.Caption pb="2">
        <Flex flex={1} alignItems="center" justifyContent="center" mb={1}>
          <Pagination
            siblingCount={2}
            count={table.getRowCount()}
            page={table.getState().pagination.pageIndex + 1}
            pageSize={table.getState().pagination.pageSize}
            onPageChange={(details) => table.setPageIndex(details.page - 1)}
          />
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Flex>
        <Text>
          Mostrando {table.getRowModel().rows.length.toLocaleString()} de{" "}
          {table.getRowCount().toLocaleString()}
        </Text>
      </Table.Caption>
    </Table.Root>
  );
};

export default DataTable;
