// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { BoardInfo } from "./BoardInfo";
import type { ErrorMessage } from "./ErrorMessage";
import type { Progress } from "./Progress";

export type Events =
  | { "kind": "BoardInfoEvent" } & BoardInfo
  | { "kind": "FlashProgressEvent" } & Progress
  | { "kind": "FlashingEnd" }
  | { "kind": "ErrorEvent" } & ErrorMessage
  | { "kind": "FileDownloadStartEvent" }
  | { "kind": "FileDownloadProgress" } & Progress
  | { "kind": "FileDownloadEndEvent" }
  | { "kind": "FileUploadProgress" } & Progress;
