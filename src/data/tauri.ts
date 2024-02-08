import { SerialPortInfo } from "@/types";
import { BoardInfo } from "@/types/BoardInfo";
import { invoke } from "@tauri-apps/api/tauri";
import { getElfDownloadUrl } from "./backend";
import { appWindow } from "@tauri-apps/api/window";
import { Progress } from "@/types/Progress";

export const getPortList = async () => {
  const ports = await invoke<Array<SerialPortInfo>>("port_list");
  return ports;
};

export const deleteFirmwareDir = async () => {
  await invoke<string>("delete_firmware_dir");
};
export const getBoardInfo = async (portName: string) => {
  const info = await invoke<BoardInfo>("board_info", {
    portName,
  });
  return info;
};

export const startFlashing = async (portName: string, version: string) => {
  const [major, minor, patch] = version.split(".").map((s) => parseInt(s));
  const data = await getElfDownloadUrl({ major, minor, patch });
  await invoke("flash", { portName, url: data.data });
};

type ProgressHandler = (progress: number, total: number) => void;
const handlers: Map<number, ProgressHandler> = new Map();
let listening = false;

async function listenToEventIfNeeded(event: string): Promise<void> {
  if (listening) {
    return await Promise.resolve();
  }

  // We're not awaiting this Promise to prevent issues with Promise.all
  // the listener will still be registered in time.
  appWindow.listen<Progress>(event, ({ payload }) => {
    const handler = handlers.get(payload.addr);
    if (handler != null) {
      handler(payload.current, payload.len);
    }
  });

  listening = true;
}

export async function upload(
  url: string,
  id: number,
  filePath: string,
  progressHandler?: ProgressHandler,
  headers?: Map<string, string>,
): Promise<void> {
  if (progressHandler != null) {
    handlers.set(id, progressHandler);
  }

  await listenToEventIfNeeded("upload");

  await invoke("upload", {
    id,
    url,
    filePath,
    headers: headers ?? {},
  });
}
