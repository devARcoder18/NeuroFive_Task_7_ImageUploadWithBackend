import axios from "axios";
import type { UploadedFileData } from "../stores/uploadStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface UploadResponse {
  success: boolean;
  message: string;
  file?: UploadedFileData;
}

export async function uploadFile(
  file: File,
  onProgress: (percent: number) => void
): Promise<UploadedFileData> {
  const formData = new FormData();
  formData.append("file", file);

  // Include the auth token if the project's authentication system is active.
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  try {
    const response = await axios.post<UploadResponse>(`${API_URL}/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      onUploadProgress: (event) => {
        if (!event.total) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      },
    });

    if (!response.data.success || !response.data.file) {
      throw new Error(response.data.message || "Upload failed.");
    }

    return response.data.file;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      if (err.code === "ECONNABORTED") {
        throw new Error("Upload timed out. Please try again.");
      }
      if (!err.response) {
        throw new Error("Unable to upload file. Please check your internet connection.");
      }
    }
    throw new Error("Unable to upload file. Please try again.");
  }
}
