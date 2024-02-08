import { deleteDevice } from "@/data/backend";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
interface DeleteFirmwareProps {
  id: string;
  refetch: () => void;
}
const DeleteDevice: React.FC<DeleteFirmwareProps> = ({ id, refetch }) => {
  const d = useMutation({
    mutationFn: async () => {
      await deleteDevice(id);
    },
    onSuccess: () => {
      toast.success("Sucess", {
        description: `Deleted ${id} device`,
      });
      refetch();
    },
  });
  return (
    <Button
      disabled={d.isPending}
      variant={"destructive"}
      size={"icon"}
      onClick={() => d.mutateAsync()}
    >
      {d.isPending ? (
        <Loader2 className="h-4 w-4" />
      ) : (
        <Trash className="h-4 w-4" />
      )}
    </Button>
  );
};

export default DeleteDevice;
