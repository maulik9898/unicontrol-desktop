import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { useDeviceStore } from "@/store";
import { ScrollArea } from "./ui/scroll-area";
import { getFirmwareList } from "@/data/backend";

const VersionSelection = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedVersion, setSelectedVersion] = useDeviceStore((state) => [
    state.selectedVersion,
    state.setSelectedVersion,
  ]);
  const versionList = useQuery({
    queryKey: ["version"],
    queryFn: async () => {
      const data = await getFirmwareList();
      console.log(data, "  ", selectedVersion);
      if (data.total_items > 0 && selectedVersion == "") {
        setSelectedVersion(data.items[0].version);
      }

      return data;
    },
  });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[130px] justify-between"
        >
          {selectedVersion}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No version found.</CommandEmpty>
          {versionList.data && (
            <ScrollArea className="h-64">
              <CommandGroup>
                {versionList.data.items.map((version) => (
                  <CommandItem
                    key={version.version}
                    value={version.version}
                    onSelect={(currentValue) => {
                      setSelectedVersion(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedVersion == version.version
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {version.version}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VersionSelection;
