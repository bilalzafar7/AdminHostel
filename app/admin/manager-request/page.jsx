"use client";
import * as React from "react";
import Link from "next/link";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    contactNumber: "555-1234-5678",
  },
  {
    id: 2,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    contactNumber: "555-2345-6789",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    contactNumber: "555-3456-7890",
  },
  {
    id: 4,
    name: "Eva White",
    email: "eva.white@example.com",
    contactNumber: "555-4567-8901",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    contactNumber: "555-5678-9012",
  },
  {
    id: 6,
    name: "Mia Davis",
    email: "mia.davis@example.com",
    contactNumber: "555-6789-0123",
  },
  {
    id: 7,
    name: "William Taylor",
    email: "william.taylor@example.com",
    contactNumber: "555-7890-1234",
  },
  {
    id: 8,
    name: "Sophie Martinez",
    email: "sophie.martinez@example.com",
    contactNumber: "555-8901-2345",
  },
  {
    id: 9,
    name: "Oscar Hall",
    email: "oscar.hall@example.com",
    contactNumber: "555-9012-3456",
  },
  {
    id: 10,
    name: "Ava Johnson",
    email: "ava.johnson@example.com",
    contactNumber: "555-0123-4567",
  },
  {
    id: 11,
    name: "Liam Smith",
    email: "liam.smith@example.com",
    contactNumber: "555-1234-5678",
  },
  {
    id: 12,
    name: "Emma Brown",
    email: "emma.brown@example.com",
    contactNumber: "555-2345-6789",
  },
  {
    id: 13,
    name: "Noah White",
    email: "noah.white@example.com",
    contactNumber: "555-3456-7890",
  },
  {
    id: 14,
    name: "Olivia Black",
    email: "olivia.black@example.com",
    contactNumber: "555-4567-8901",
  },
  {
    id: 15,
    name: "Sophia Green",
    email: "sophia.green@example.com",
    contactNumber: "555-5678-9012",
  },
  {
    id: 16,
    name: "Jackson Davis",
    email: "jackson.davis@example.com",
    contactNumber: "555-6789-0123",
  },
  {
    id: 17,
    name: "Lily Taylor",
    email: "lily.taylor@example.com",
    contactNumber: "555-7890-1234",
  },
  {
    id: 18,
    name: "Lucas Martinez",
    email: "lucas.martinez@example.com",
    contactNumber: "555-8901-2345",
  },
  {
    id: 19,
    name: "Avery Hall",
    email: "avery.hall@example.com",
    contactNumber: "555-9012-3456",
  },
  {
    id: 20,
    name: "Ethan Johnson",
    email: "ethan.johnson@example.com",
    contactNumber: "555-0123-4567",
  },
];

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "contactNumber",
    cell: ({ row }) => <div>{row.getValue("contactNumber")}</div>,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact No.
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="space-x-4">
        <Button>Approve</Button>
        <Button variant="destructive">Disapprove</Button>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/admin/manager-request/${row.getValue("id")}`}
        >
          Detail
        </Link>
      </div>
    ),
  },
];

function ManagerRequestsPage() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageIndex, setPageIndex] = React.useState(0);

  const pageSize = 10; // Set your desired page size

  const table = useReactTable({
    data: usersData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel({ pageIndex, pageSize }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  React.useEffect(() => {
    table.setGlobalFilter(globalFilter);
  }, [globalFilter, table]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Hostel Owner Request
      </h1>
      <div className="mb-4">
        <Input
          placeholder="Search by name, email, or contact number..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-black max-w-md"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => prev + 1)}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ManagerRequestsPage;
