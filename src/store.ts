import { create } from "zustand";
import "./event";
import { Message, MessageType } from "./types";
import { FileType } from "./types/FileType";

interface DeviceStore {
  selectedPort: string;
  selectedVersion: string;
  logs: Map<string, Message>;
  addLog: (key: string, value: string, type: MessageType) => void;
  clearLog: () => void;
  isFlasing: boolean;
  setIsFlasing: (data: boolean) => void;
  setSelectedVersion: (data: string) => void;
  setSelectedPort: (port: string) => void;
  files: Map<FileType, string>;
  setFile: (type: FileType, data: string) => void;
  isUploading: boolean;
  setIsuploading: (data: boolean) => void;
  uploadProgress: Map<FileType, number>;
  setUploadProgress: (key: FileType, value: number) => void;
}

export const useDeviceStore = create<DeviceStore>()((set, get) => ({
  selectedPort: "",
  selectedVersion: "",
  isFlasing: false,
  files: new Map(),
  isUploading: false,
  uploadProgress: new Map(),
  setUploadProgress: (type, data) =>
    set((state) => ({
      uploadProgress: new Map(state.uploadProgress).set(type, data),
    })),
  setIsuploading: (data) => {
    set(() => ({ isUploading: data }));
    if (data) {
      set(() => ({ uploadProgress: new Map() }));
    }
  },
  setFile: (type, data) => {
    set((state) => {
      let m = new Map(state.uploadProgress);
      m.delete(type);
      return {
        files: new Map(state.files).set(type, data),
        uploadProgress: m,
      };
    });
  },

  setIsFlasing: (data) => {
    if (data) {
      get().clearLog();
    }
    set(() => ({ isFlasing: data }));
  },
  logs: new Map<string, Message>(),
  addLog: (key, value, type) =>
    set((prev) => ({
      logs: new Map(prev.logs).set(key, { message: value, type: type }),
    })),
  clearLog: () => set(() => ({ logs: new Map() })),
  setSelectedVersion: (data) => set(() => ({ selectedVersion: data })),
  setSelectedPort: (port) => set(() => ({ selectedPort: port })),
}));

// interface InteractionStore {
// }
//
// export const useInteractionStore = create<InteractionStore>()(
//   persist(
//     (set) => ({
//     }),
//     {
//       name: "interaction-storage",
//     },
//   ),
// );
