import { useState } from "react";
import FirmwareTable from "./FirmwareTable";
import { firmwareColumns } from "./firmware-column";
import { ColumnFiltersState, functionalUpdate } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getFirmwareList } from "@/data/backend";
import { Input } from "../ui/input";
const FirmwareList = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const firmwares = useQuery({
    queryKey: ["firmwares", columnFilters],
    queryFn: async () => {
      const version = columnFilters?.find((d) => d.id == "version")
        ?.value as string;
      const data = await getFirmwareList({
        page: 1,
        page_size: 500,
        version: version || undefined,
      });

      return data;
    },
  });

  console.log("columnFilters", columnFilters);
  return (
    <div className=" w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter version..."
          value={
            (columnFilters?.find((d) => d.id == "version")?.value as string) ||
            ""
          }
          onChange={(event) => {
            setColumnFilters((s) =>
              functionalUpdate(
                [{ id: "version", value: event.target.value }],
                s,
              ),
            );
          }}
          className="max-w-sm"
        />
      </div>
      <FirmwareTable
        refetch={() => firmwares.refetch()}
        columns={firmwareColumns}
        data={firmwares.data?.items || []}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default FirmwareList;
