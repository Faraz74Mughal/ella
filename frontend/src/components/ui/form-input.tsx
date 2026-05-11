import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

type InputProps = React.ComponentProps<typeof Input>;

type FormInputProps = {
  control: any;
  name: string;
  label?: string;
  itemClassName?: string;
  labelClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputProps;

export function FormInput({
  control,
  name,
  label,
  type = "text",
  itemClassName,
  labelClassName,
  onChange,
  ...rest
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value: any = e.target.value;

          if (type === "number") {
            value = e.target.value === "" ? "" : e.target.valueAsNumber;
          }

          // update RHF field
          field.onChange(value);

          // call custom onChange if exists
          if (onChange) {
            onChange(e);
          }
        };

        return (
          <FormItem className={itemClassName + `${label ? ' space-y-2' : ' space-y-0'}`}>
            {label && <FormLabel className={labelClassName }>{label}</FormLabel>}

            <FormControl>
              <Input
                {...field}
                {...rest}
                type={type}
                value={field.value ?? ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
