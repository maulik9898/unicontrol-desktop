import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useDeviceStore } from "@/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { checkDevice } from "@/data/backend";
import { getBoardInfo } from "@/data/tauri";
import axios, { AxiosError } from "axios";

const DeviceStatus = () => {
  const selectedPort = useDeviceStore((state) => state.selectedPort);
  const isFlasing = useDeviceStore((state) => state.isFlasing);
  const clearLogs = useDeviceStore((state) => state.clearLog);
  const statusData = useMutation({
    mutationKey: ["check"],
    mutationFn: async () => {
      clearLogs();
      const info = await getBoardInfo(selectedPort);
      if (info) {
        await checkDevice(info.mac_address);
      }
    },
    onSuccess: () => {
      toast.success("Device is registered", {
        duration: 4000,
      });
    },
    onError: (error: Error | AxiosError, _variables, _context) => {
      console.log("ERROR", error);
      if (axios.isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data.message,
          duration: 5000,
          dismissible: true,
        });
      } else {
        toast.error("Error", {
          description: error.message,
          duration: 5000,
          dismissible: true,
        });
      }
    },
  });

  return (
    <>
      <Button
        variant={"secondary"}
        disabled={statusData.isPending || selectedPort == "" || isFlasing}
        onClick={() => statusData.mutate()}
      >
        {statusData.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Check Status
      </Button>
    </>
  );
};

export default DeviceStatus;
