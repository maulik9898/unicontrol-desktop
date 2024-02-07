import { listen } from "@tauri-apps/api/event";
import { Events } from "./types/Events";
import { BoardInfo } from "./types/BoardInfo";
import { useDeviceStore } from "./store";
import { Progress } from "./types/Progress";
import { ErrorMessage } from "./types/ErrorMessage";

const _unlisten = await listen<Events>("logs", (event) => {
  console.log("logs", event.payload);
  switch (event.payload.kind) {
    case "BoardInfoEvent":
      handleBoardInfoEvent(event.payload, event.payload.kind);
      break;
    case "FlashProgressEvent":
      handleFlashProgressEvent(event.payload);
      break;

    case "FlashingEnd":
      handleFlashingEnd(event.payload.kind);
      break;
    case "ErrorEvent":
      handleErrorEvent(event.payload);
      break;
    case "FileDownloadStartEvent":
      handleFileDownloadStartEvent(event.payload.kind);
      break;
    case "FileDownloadEndEvent":
      handleFileDownloadEndEvent(event.payload.kind);
      break;
    case "FileDownloadProgress":
      handleFileDownloadProgress(event.payload, event.payload.kind)
      break;
  }
});


const handleFileDownloadProgress  = (progress: Progress, kind: string) => {
  
  let val = `Progress   ${createProgressBar(progress.current, progress.len)}     ${fileSize(progress.current)}/${fileSize(progress.len)}`;
  useDeviceStore.getState().addLog(kind, val, "INFO");
}
const handleFileDownloadEndEvent = (kind: string) => {
  useDeviceStore
    .getState()
    .addLog(kind, "File downloading complete...", "INFO");
};
const handleFileDownloadStartEvent = (kind: string) => {
  useDeviceStore.getState().addLog(kind, "File downloading...", "INFO");
};

const handleErrorEvent = (error: ErrorMessage) => {
  console.log("Error event", error);
  useDeviceStore
    .getState()
    .addLog(
      error.error_type,
      `Error: [${error.error_type}]  ${error.message}`,
      "ERROR",
    );
};

const createProgressBar = (current: number, len: number ): string => {
  const barLength = 40; // Total length of the progress bar
  const ratio = current / len;
  const filledBarLength = Math.round(ratio * barLength);
  const isComplete = current >= len;
  const head = !isComplete && filledBarLength > 0 ? 1 : 0; // Add a head if progress is not complete and not at 0

  const filledBar = "=".repeat(filledBarLength);
  const headChar = !isComplete && filledBarLength > 0 ? ">" : "="; // Use ">" as head if not complete
  const emptyBar = " ".repeat(barLength - filledBarLength);

  const progressBar = `[${filledBar}${headChar}${emptyBar}]`;
  return progressBar;
};

const handleBoardInfoEvent = (event: BoardInfo, key: string) => {
  const info = event;
  let value = `Chip type:         ${info.chip} revision ${info.revision}
Crystal frequency: ${info.crystal_frequency}
Flash size:        ${info.flash_size}
Features:          ${info.features}
MAC address:       ${info.mac_address}
`;

  useDeviceStore.getState().addLog(key, value, "INFO");
};

const handleFlashProgressEvent = (event: Progress) => {
  // Calculate the padding needed for consistent alignment
  // Assuming a maximum expected address length for display purposes
  const maxAddressLength = 8; // Adjust based on your maximum expected address
  const addressString = `0x${event.addr.toString(16)}`; // Convert address to hex string
  const paddedAddress = addressString.padEnd(maxAddressLength + 2, " "); // +2 for '0x'

  let val = `${paddedAddress} ${createProgressBar(event.current, event.len)}     ${event.current}/${event.len}`;

  useDeviceStore.getState().addLog(`${event.addr}`, val, "INFO");
};

const handleFlashingEnd = (key: string) => {
  useDeviceStore.getState().addLog(key, "Flashing Done ...", "SUCCESS");
};


export const fileSize = (b: number) => {
   let u = 0, s=1000;
    while (b >= s || -b >= s) {
        b /= s;
        u++;
    }
    return (u ? b.toFixed(1) + ' ' : b) + ' KMGTPEZY'[u] + 'B';
}
