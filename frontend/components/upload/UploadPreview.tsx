import UploadProgress from "./UploadProgress";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadPreviewProps {
  file: File;
  previewUrl: string;
  status: "selected" | "uploading" | "error";
  progress: number;
  error: string | null;
  onUpload: () => void;
  onRemove: () => void;
}

export default function UploadPreview({
  file,
  previewUrl,
  status,
  progress,
  error,
  onUpload,
  onRemove,
}: UploadPreviewProps) {
  const isUploading = status === "uploading";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-40 h-40 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <img
            src={previewUrl}
            alt="Selected file preview"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatBytes(file.size)} • {file.type.split("/")[1]?.toUpperCase()}
            </p>
          </div>

          {isUploading && <UploadProgress progress={progress} />}

          {error && status === "error" && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {!isUploading && (
            <div className="flex gap-2 mt-auto">
              <button
                onClick={onRemove}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Remove
              </button>
              <button
                onClick={onUpload}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Upload File
              </button>
            </div>
          )}

          {isUploading && (
            <button
              disabled
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-400 cursor-not-allowed inline-flex items-center gap-2 w-fit"
            >
              <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Uploading...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
