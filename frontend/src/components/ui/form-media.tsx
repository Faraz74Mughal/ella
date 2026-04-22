import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Input } from "./input"

export type MediaType = "image" | "video" | "audio"

type FormMediaProps = {
  control: any
  name: string
  label: string
  type?: MediaType
  disabled?: boolean
  defaultPreview?: string // for edit mode (existing file URL)
}

export function FormMedia({
  control,
  name,
  label,
  type = "image",
  disabled,
  defaultPreview,
}: FormMediaProps) {
  const getAccept = () => {
    if (type === "image") return "image/*"
    if (type === "video") return "video/*"
    if (type === "audio") return "audio/*"
    return "*/*"
  }

  const renderPreview = (fileUrl: string) => {
    if (type === "image") {
      return (
        <img
          src={fileUrl}
          className="h-32 w-full rounded-md object-cover"
        />
      )
    }

    if (type === "video") {
      return (
        <video controls className="h-40 w-full rounded-md">
          <source src={fileUrl} />
        </video>
      )
    }

    if (type === "audio") {
      return (
        <audio controls className="w-full">
          <source src={fileUrl} />
        </audio>
      )
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const file = field.value
        const preview =
          file
            ? URL.createObjectURL(file)
            : defaultPreview || null

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <FormControl>
              <div className="space-y-3">
                {/* Preview */}
                {preview && (
                  <div className="relative rounded-md border p-2">
                    {renderPreview(preview)}

                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white"
                      onClick={() => field.onChange(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Upload */}
                {!preview && (
                  <Input
                    type="file"
                    accept={getAccept()}
                    disabled={disabled}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      field.onChange(file)
                    }}
                  />
                )}

                {/* Replace button */}
                {preview && (
                  <Input
                    type="file"
                    accept={getAccept()}
                    disabled={disabled}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      field.onChange(file)
                    }}
                  />
                )}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}