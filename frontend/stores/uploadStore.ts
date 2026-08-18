import { create } from "zustand";

export type UploadStatus = "idle" | "selected" | "uploading" | "success" | "error";

export interface UploadedFileData {
  url: string;
  publicId: string;
  name: string;
  type: string;
  size: number;
}

interface UploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  status: UploadStatus;
  uploadProgress: number;
  uploadedFile: UploadedFileData | null;
  error: string | null;

  setFile: (file: File, previewUrl: string) => void;
  removeFile: () => void;
  startUploading: () => void;
  setProgress: (progress: number) => void;
  setSuccess: (file: UploadedFileData) => void;
  setError: (message: string) => void;
  resetUpload: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  selectedFile: null,
  previewUrl: null,
  status: "idle",
  uploadProgress: 0,
  uploadedFile: null,
  error: null,

  setFile: (file, previewUrl) => {
    // Revoke any previous blob URL to avoid leaking memory.
    const prev = get().previewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      selectedFile: file,
      previewUrl,
      status: "selected",
      error: null,
      uploadProgress: 0,
      uploadedFile: null,
    });
  },

  removeFile: () => {
    const prev = get().previewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      selectedFile: null,
      previewUrl: null,
      status: "idle",
      error: null,
      uploadProgress: 0,
    });
  },

  startUploading: () => set({ status: "uploading", uploadProgress: 0, error: null }),

  setProgress: (progress) => set({ uploadProgress: progress }),

  setSuccess: (file) =>
    set({
      status: "success",
      uploadedFile: file,
      uploadProgress: 100,
      error: null,
    }),

  setError: (message) => set({ status: "error", error: message }),

  resetUpload: () => {
    const prev = get().previewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      selectedFile: null,
      previewUrl: null,
      status: "idle",
      uploadProgress: 0,
      uploadedFile: null,
      error: null,
    });
  },
}));
