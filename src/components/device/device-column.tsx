
import { Device } from "@/types/Device";
import { ColumnDef } from "@tanstack/react-table";

export const deviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "registered_on",
    header: "Registered on",
  },
];
