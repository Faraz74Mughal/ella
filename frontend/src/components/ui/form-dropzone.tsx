import { FileDropzone } from "../shared/file-dropzone";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

type FormFileDropzoneProps = {
  control: any;
  name: string;
  label: string;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
};

export function FormFileDropzone({
  control,
  name,
  label,
  accept,
  maxSizeMB,
}: FormFileDropzoneProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <FileDropzone
              value={field.value}
              onFileSelect={(file) => field.onChange(file)}
              onRemove={() => field.onChange(null)}
              accept={accept}
              maxSizeMB={maxSizeMB}
              onError={(msg) => {
                console.error(msg);
              }}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
