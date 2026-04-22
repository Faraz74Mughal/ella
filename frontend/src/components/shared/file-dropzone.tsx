import { useCallback } from "react";
import { useDropzone } from "react-dropzone"; 
import { FileUp, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  value?: File | string | null;
  label: string;
  accept?: Record<string, string[]>;
}

export function FileDropzone({ onFileSelect, onRemove, value, label, accept }: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    
    if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  if (value) {
    return (
      <div className="relative flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-[200px]">
              {typeof value === "string" ? "Uploaded Document" : value.name}
            </span>
            <span className="text-xs text-muted-foreground">Ready to upload</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove}><X className="h-4 w-4" /></Button>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 transition-colors text-center cursor-pointer ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary"}`}>
      <input {...getInputProps()} />
      <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">PDF, PNG, or JPG (Max 5MB)</p>
    </div>
  );
}