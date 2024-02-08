import { deleteFirmware } from "@/data/backend";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
interface DeleteFirmwareProps {
  version: string;
    refetch: () => void;

}
const DeleteFirmware: React.FC<DeleteFirmwareProps> = ({ version, refetch }) => {
  const d = useMutation({
    mutationFn: async () => {
      const [major, minor, patch] = version.split(".").map((d) => parseInt(d));
      await deleteFirmware({ major, minor, patch });
    },
    onSuccess: () => {
      toast.success("Sucess", {
        description: `Deleted ${version} firmware`,
      });
      refetch()
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

export default DeleteFirmware;
