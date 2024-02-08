import { Firmware } from "@/types/Firmware";
import { ColumnDef } from "@tanstack/react-table";

export const firmwareColumns: ColumnDef<Firmware>[] = [
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "filename",
    header: "Name",
  },
  {
    accessorKey: "uploaded",
    header: "Uploaded at",
  },
];
