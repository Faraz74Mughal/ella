import { Checkbox } from "./checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"

type FormCheckboxProps = {
  control: any
  name: string
  label: string
  disabled?: boolean
}

export function FormCheckbox({
  control,
  name,
  label,
  disabled,
}: FormCheckboxProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>

          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}