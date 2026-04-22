import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLabel } from "./form";

interface Option {
  label: string;
  value: string | number;
}

interface AppSelectProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  label?: string;
}

const AppSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
  label
}: AppSelectProps) => {
  return (
    <div>
      {label&&<FormLabel className="mb-2">{label}</FormLabel>}
      <Select
        value={value ? String(value) : undefined}
        onValueChange={(val) => onChange?.(val)}
      >
        <SelectTrigger className={`w-full ${className || ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppSelect;
