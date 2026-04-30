// import { useCallback } from "react";
// import { useDropzone } from "react-dropzone";
// import { FileUp, X, FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface FileDropzoneProps {
//   onFileSelect: (file: File) => void;
//   onRemove: () => void;
//   value?: File | string | null;
//   label: string;
//   accept?: Record<string, string[]>;
// }

// export function FileDropzone({ onFileSelect, onRemove, value, label, accept }: FileDropzoneProps) {
//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     console.log(acceptedFiles);

//     if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
//   }, [onFileSelect]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept,
//     multiple: false,
//   });

//   if (value) {
//     return (
//       <div className="relative flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
//         <div className="flex items-center gap-3">
//           <FileText className="h-8 w-8 text-primary" />
//           <div className="flex flex-col">
//             <span className="text-sm font-medium truncate max-w-[200px]">
//               {typeof value === "string" ? "Uploaded Document" : value.name}
//             </span>
//             <span className="text-xs text-muted-foreground">Ready to upload</span>
//           </div>
//         </div>
//         <Button variant="ghost" size="icon" onClick={onRemove}><X className="h-4 w-4" /></Button>
//       </div>
//     );
//   }

//   return (
//     <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 transition-colors text-center cursor-pointer ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary"}`}>
//       <input {...getInputProps()} />
//       <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
//       <p className="text-sm font-medium">{label}</p>
//       <p className="text-xs text-muted-foreground mt-1">PDF, PNG, or JPG (Max 5MB)</p>
//     </div>
//   );
// }

import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp,  FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  value?: File | string | null;
  label: string;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  onError?: (message: string) => void;
}

export function FileDropzone({
  onFileSelect,
  onRemove,
  value,
  label,
  accept,
  maxSizeMB = 5,
  onError,
}: FileDropzoneProps) {
  const maxSize = maxSizeMB * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        if (onError)
          onError("File rejected. Please ensure it meets the requirements.");
        return;
      }

      if (acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, onError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    maxSize,
  });

  // 🔍 Detect file type
  const fileType = useMemo(() => {
    if (!value || typeof value === "string") return null;
    if (value.type.startsWith("image")) return "image";
    if (value.type.startsWith("video")) return "video";
    if (value.type.startsWith("audio")) return "audio";
    return "file";
  }, [value]);

  // 🔗 Preview URL
  const previewUrl = useMemo(() => {
    if (!value || typeof value === "string") return null;
    return URL.createObjectURL(value);
  }, [value]);

  // ✅ When file is selected
  if (value) {
    return (
      <div className="relative p-4 border rounded-xl bg-white shadow-sm">
        {/* Preview */}
        <div className="mb-4 rounded-lg overflow-hidden bg-black/5 flex items-center justify-center">
          {fileType === "image" && (
            <img
              src={previewUrl!}
              alt="preview"
              className="max-h-[200px] object-contain"
            />
          )}

          {fileType === "video" && (
            <video
              src={previewUrl!}
              controls
              className="max-h-[250px] w-full"
            />
          )}

          {fileType === "audio" && (
            <audio src={previewUrl!} controls className="w-full" />
          )}

          {fileType === "file" && (
            <FileText className="h-16 w-16 text-muted-foreground my-6" />
          )}
        </div>

        {/* File Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[200px]">
                {typeof value === "string" ? "Uploaded File" : value.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {value instanceof File &&
                  `${(value.size / (1024 * 1024)).toFixed(2)} MB`}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="hover:bg-red-100 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    );
  }

  // 📦 Dropzone UI
  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-all duration-200
        ${
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
        }
      `}
    >
      <input {...getInputProps()} />

      <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-3" />

      <p className="text-sm font-semibold">{label}</p>

      <p className="text-xs text-muted-foreground mt-1">
        Max {maxSizeMB}MB • Supports images, video, audio, PDF
      </p>
    </div>
  );
}
