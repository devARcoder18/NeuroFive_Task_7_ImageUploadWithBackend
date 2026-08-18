"use client";

import { useEffect, useState } from "react";
import FileUpload from "../../components/upload/FileUpload";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// Swap this local toast implementation for your existing toast system
// (the same one used across the TaskFlow / auth pages) if available.
export default function UploadPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => setToasts((prev) => prev.slice(1)), 3500);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Upload File</h1>
        <p className="text-sm text-gray-500 mb-6">
          Upload an image to Cloudinary. JPG, PNG, and WEBP up to 5 MB.
        </p>

        <FileUpload onNotify={showToast} />
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-md text-sm font-medium text-white ${
              t.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {t.type === "success" ? "✓ " : "✕ "}
            {t.message}
          </div>
        ))}
      </div>
    </main>
  );
}
