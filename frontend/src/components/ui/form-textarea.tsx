import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Textarea } from "./textarea"

type FormTextareaProps = {
  control: any
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
  rows?: number
}

export function FormTextarea({
  control,
  name,
  label,
  placeholder,
  disabled,
  rows = 14,
}: FormTextareaProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}