import { useState } from "react";
import { Input } from "../ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFirmwareList, getUploadUrls } from "@/data/backend";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useDeviceStore } from "@/store";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { upload } from "@/data/tauri";

const versionSchema = z.object({
  major: z.coerce.number(),
  minor: z.coerce.number(),
  patch: z.coerce.number(),
});
const UploadVersion = () => {
  const [files, isUploading, setIsuploading, setUploadProgress] =
    useDeviceStore((state) => [
      state.files,
      state.isUploading,
      state.setIsuploading,
      state.setUploadProgress,
    ]);

  const [latestFirmware, setLatestFirmware] = useState("");
  const form = useForm<z.infer<typeof versionSchema>>({
    resolver: zodResolver(versionSchema),
    defaultValues: {
      major: 0,
      minor: 0,
      patch: 0,
    },
    mode: "onChange",
  });
  const fetchLatest = useQuery({
    queryKey: ["latest"],
    queryFn: async () => {
      const firmware = await getFirmwareList({ page: 1, page_size: 1 });
      if (firmware.total_items > 0) {
        setLatestFirmware(firmware.items[0].version);
      }
      return firmware;
    },
  });

  const uploadFile = useMutation({
    mutationFn: async () => {
      const uploadData = await getUploadUrls(form.getValues());
      console.log(uploadData);
      const binUrl = uploadData.data.data.filter((d) => d.file_type == "bin")[0]
        .url;
      const elfUrl = uploadData.data.data.filter((d) => d.file_type == "elf")[0]
        .url;
      const uploadBin = upload(
        binUrl,
        0,
        files.get("bin")!,
        (progress, total) => {
          let p = (progress / total) * 100;
          console.log("BIN ", p, "%");
          setUploadProgress("bin", p);
        },
      );
      const uploadElf = upload(
        elfUrl,
        1,
        files.get("elf")!,
        (progress, total) => {
          let p = (progress / total) * 100;
          console.log("ELF ", p, "%");
          setUploadProgress("elf", p);
        },
      );
      const result = await Promise.all([uploadBin, uploadElf]);
      return result;
    },
    onMutate: () => setIsuploading(true),
    onSettled: () => {
      setIsuploading(false);
      fetchLatest.refetch();
    },
    onError(error, _variable, _context) {
      console.log("Error Uploading", error);
      if (axios.isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data.message,
          duration: 5000,
          dismissible: true,
        });
      }
    },
    onSuccess: () => {
      const value = form.getValues();
      toast.success(
        `Firmware ${value.major}.${value.minor}.${value.patch} uploaded`,
      );
    },
  });

  const onSubmit = form.handleSubmit((_data) => {
    uploadFile.mutate();
  });

  const isDisabled =
    !files.has("bin") ||
    !files.has("elf") ||
    !form.formState.isValid ||
    isUploading;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg">Upload Version</span>
      <form
        className="flex flex-col justify-between w-full gap-4"
        onSubmit={onSubmit}
      >
        <div className="flex justify-between gap-2">
          <div className="flex flex-row justify-between gap-4">
            <Input
              className="w-20 font-mono"
              type="number"
              {...form.register("major", { valueAsNumber: true })}
            />
            <Input
              className="w-20 font-mono"
              type="number"
              {...form.register("minor", { valueAsNumber: true })}
            />
            <Input
              className="w-20 font-mono"
              type="number"
              {...form.register("patch", { valueAsNumber: true })}
            />
          </div>
          <div className="flex gap-6 align-bottom ">
            <span className="text-lg font-semibold">Current latest:</span>
            <span className="text-lg font-mono">{latestFirmware}</span>
          </div>
        </div>
        <Button type="submit" disabled={isDisabled}>
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload
        </Button>
      </form>
    </div>
  );
};

export default UploadVersion;
