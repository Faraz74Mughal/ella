import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

import { RadioGroup, RadioGroupItem } from "./radio-group";

type FormRadioProps = {
  control: any;
  name: string;
  label?: string;
  value: string;
  optionLabel?: string;
  disabled?: boolean;
};

export function FormRadio({
  control,
  name,
  label,
  value,
  optionLabel,
  disabled,
}: FormRadioProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`${name}-${value}`} />

                {optionLabel && (
                  <label
                    htmlFor={`${name}-${value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {optionLabel}
                  </label>
                )}
              </div>
            </RadioGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
