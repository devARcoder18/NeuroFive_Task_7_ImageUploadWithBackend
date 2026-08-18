interface UploadProgressProps {
  progress: number;
}

export default function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-600">Uploading...</span>
        <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
