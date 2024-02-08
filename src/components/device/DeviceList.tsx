import { useState } from "react";
import { ColumnFiltersState, functionalUpdate } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getDeviceList } from "@/data/backend";
import { Input } from "../ui/input";
import { deviceColumns } from "./device-column";
import DeviceTable from "./DeviceTable";
const DeviceList = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const devices = useQuery({
    queryKey: ["devices", columnFilters],
    queryFn: async () => {
      const id = columnFilters?.find((d) => d.id == "id")?.value as string;

      const email = columnFilters?.find((d) => d.id == "email")
        ?.value as string;
      const data = await getDeviceList({
        page: 1,
        page_size: 500,
        id,
        email,
      });

      return data;
    },
  });

  console.log("columnFilters", columnFilters);
  return (
    <div className=" w-full">
      <div className="flex gap-4 items-center py-4">
        <Input
          placeholder="Filter id..."
          value={
            (columnFilters?.find((d) => d.id == "id")?.value as string) || ""
          }
          onChange={(event) => {
            setColumnFilters((s) =>
              functionalUpdate([{ id: "id", value: event.target.value }], s),
            );
          }}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter emails..."
          value={
            (columnFilters?.find((d) => d.id == "email")?.value as string) || ""
          }
          onChange={(event) => {
            setColumnFilters((s) =>
              functionalUpdate([{ id: "email", value: event.target.value }], s),
            );
          }}
          className="max-w-sm"
        />
      </div>
      <DeviceTable
        refetch={() => devices.refetch()}
        columns={deviceColumns}
        data={devices.data?.items || []}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default DeviceList;
