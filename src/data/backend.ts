import axiosInstance from "@/axios";
import { Device } from "@/types/Device";
import { DeviceParam } from "@/types/DeviceParam";
import { FileUpload } from "@/types/FileUpload";
import { Firmware } from "@/types/Firmware";
import { FirmwareParams } from "@/types/FirmwareParams";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { Pagination } from "@/types/Pagination";
import { RegisterDevice } from "@/types/RegisterDevice";
import { Url } from "@/types/Url";
import { Version } from "@/types/Version";

export const getFirmwareList = async (
  page: Pagination<FirmwareParams> | null,
) => {
  const { data } = await axiosInstance.get<PaginatedResponse<Firmware>>(
    "firmware",
    { params: page },
  );
  return data;
};

export const checkDevice = async (id: string) => {
  await axiosInstance.get("device/check", {
    headers: {
      "x-esp32-sta-mac": id,
    },
  });
};

export const registerDevice = async (device: RegisterDevice) => {
  const data = await axiosInstance.post<Device>("device", {
    id: device.id,
    email: device.email,
    user_id: device.user_id,
  });
  return data;
};

export const getElfDownloadUrl = async (version: Version) => {
  const data = await axiosInstance.post<Url>("firmware/download/elf", version);
  return data;
};

export const getUploadUrls = async (version: Version) => {
  const data = await axiosInstance.post<FileUpload>("firmware/upload", version);
  return data;
};

export const deleteFirmware = async (version: Version) => {
  const data = await axiosInstance.delete("firmware", { data: version });
  return data;
};

export const deleteDevice = async (id: string) => {
  const data = await axiosInstance.delete("device", {
    headers: {
      "x-esp32-sta-mac": id,
    },
  });
  return data;
};

export const getDeviceList = async (page: Pagination<DeviceParam> | null) => {
  const { data } = await axiosInstance.get<PaginatedResponse<Device>>(
    "device",
    { params: page },
  );
  return data;
};
