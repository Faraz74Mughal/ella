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
  label: string;
} & InputProps;

export function FormInput({
  control,
  name,
  label,
  type = "text",
  ...rest
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (type === "number") {
            field.onChange(e.target.value === "" ? "" : e.target.valueAsNumber);
          } else {
            field.onChange(e.target.value);
          }
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

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
