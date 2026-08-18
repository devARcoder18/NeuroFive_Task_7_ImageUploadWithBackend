"use client";

import { useCallback, useRef, useState } from "react";
import { useUploadStore } from "../../stores/uploadStore";
import { uploadFile as uploadFileToApi } from "../../services/uploadApi";
import UploadPreview from "./UploadPreview";
import UploadedFile from "./UploadedFile";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

interface FileUploadProps {
  // Plug in your existing toast system here, e.g. from a Toast context/hook.
  onNotify?: (message: string, type: "success" | "error") => void;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload JPG, PNG, JPEG, or WEBP.";
  }
  if (file.size > MAX_SIZE) {
    return "File is too large. Maximum allowed size is 5 MB.";
  }
  return null;
}

export default function FileUpload({ onNotify }: FileUploadProps) {
  const {
    selectedFile,
    previewUrl,
    status,
    uploadProgress,
    uploadedFile,
    error,
    setFile,
    removeFile,
    startUploading,
    setProgress,
    setSuccess,
    setError,
    resetUpload,
  } = useUploadStore();

  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const notify = (message: string, type: "success" | "error") => {
    onNotify?.(message, type);
  };

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) {
        setError("Please select a file.");
        notify("Please select a file.", "error");
        return;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        notify(validationError, "error");
        return;
      }

      const previewObjectUrl = URL.createObjectURL(file);
      setFile(file, previewObjectUrl);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    // Reset so selecting the same file again still fires onChange.
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    startUploading();
    try {
      const result = await uploadFileToApi(selectedFile, (percent) => setProgress(percent));
      setSuccess(result);
      notify("File uploaded successfully!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
      notify(message, "error");
    }
  };

  // --- Success state: show the real, backend-stored file ---
  if (status === "success" && uploadedFile) {
    return <UploadedFile file={uploadedFile} onUploadAnother={resetUpload} />;
  }

  // --- Selected / uploading / error-with-file state: show preview ---
  if (selectedFile && previewUrl && status !== "idle") {
    return (
      <UploadPreview
        file={selectedFile}
        previewUrl={previewUrl}
        status={status === "error" ? "error" : status === "uploading" ? "uploading" : "selected"}
        progress={uploadProgress}
        error={error}
        onUpload={handleUpload}
        onRemove={removeFile}
      />
    );
  }

  // --- Initial / dragging state: the drop zone ---
  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed px-6 py-14 cursor-pointer transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40"
        }`}
      >
        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-slate-700 font-medium">
          {isDragging ? "Release to upload" : "Drag & drop your file here"}
        </p>
        <p className="text-sm text-gray-500 mt-1">or</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="mt-3 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Browse Files
        </button>

        <p className="text-xs text-gray-400 mt-4">JPG, PNG, WEBP • Max 5 MB</p>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={onInputChange}
          className="hidden"
        />
      </div>

      {error && status === "error" && (
        <p className="text-sm text-red-600 mt-3">{error}</p>
      )}
    </div>
  );
}
