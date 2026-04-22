import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { RadioGroupItem,RadioGroup } from "./radio-group"

type Option = {
  label: string
  value: string
}

type FormRadioProps = {
  control: any
  name: string
  label: string
  options: Option[]
  disabled?: boolean
}

export function FormRadio({
  control,
  name,
  label,
  options,
  disabled,
}: FormRadioProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
              className="flex flex-col space-y-2"
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}