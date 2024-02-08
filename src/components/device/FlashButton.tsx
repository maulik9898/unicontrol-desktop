import { Loader2, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useDeviceStore } from "@/store";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getBoardInfo, startFlashing } from "@/data/tauri";
import { registerDevice } from "@/data/backend";

const FlashButton = () => {
  const { selectedPort, isFlashing, setIsFlashing, addLog, selectedVersion } = useDeviceStore(
    (state) => ({
      selectedPort: state.selectedPort,
      isFlashing: state.isFlasing,
      setIsFlashing: state.setIsFlasing,
      addLog: state.addLog,
      selectedVersion: state.selectedVersion
    }),
  );
  const flasing = useMutation({
    mutationFn: async () => {
      return await flash();
    },
    onMutate(_variables) {
      setIsFlashing(true);
    },
    onSuccess(variables) {
      if (variables.status == 208) {
        toast.success("Device Already Registered", {
          dismissible: true,
          duration: 3000,
        });
      } else {
        toast.success("Device Registered", {
          dismissible: true,
          duration: 3000,
        });
      }
    },
    onError(error, _variables, _context) {
      console.log("Error ", error)
      toast.error("Error Flashing Device", {
        description: error.message,
        dismissible: true,
        duration: 3000,
      });
    },
    onSettled() {
      setIsFlashing(false);
    },
  });

  const flash = async () => {
    await startFlashing(selectedPort, selectedVersion);
    addLog("deviceRegister", "Registering Device ...","INFO");
    const info = await getBoardInfo(selectedPort);
    const attr = await fetchUserAttributes();
    const data = await registerDevice({
      id: info.mac_address,
      email: attr.email!,
      user_id: attr.sub!,
    });
    if (data.status == 208) {
      addLog("deviceRegistrationStatus", "Device already registered ...", "INFO");
    } else {
      addLog("deviceRegistrationStatus", "Device registered ...", "SUCCESS");
    }
    return data;
  };
  return (
    <Button disabled={isFlashing || selectedPort == ""} onClick={() => flasing.mutate()}>
      {isFlashing ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Zap className="h-4 w-4 mr-4" />
      )}
      Flash
    </Button>
  );
};

export default FlashButton;
