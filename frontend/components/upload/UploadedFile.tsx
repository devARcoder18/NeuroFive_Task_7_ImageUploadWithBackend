import type { UploadedFileData } from "../../stores/uploadStore";

interface UploadedFileProps {
  file: UploadedFileData;
  onUploadAnother: () => void;
}

export default function UploadedFile({ file, onUploadAnother }: UploadedFileProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">
          ✓
        </span>
        <p className="text-sm font-medium text-green-600">Upload successful</p>
      </div>

      <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        {/* Real Cloudinary URL returned by the backend - not the blob preview */}
        <img src={file.url} alt={file.name} className="w-full h-full object-contain" />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-slate-700 truncate">{file.name}</p>
        <div className="flex gap-2 shrink-0">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors text-center"
          >
            View Image
          </a>
          <button
            onClick={onUploadAnother}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  );
}
