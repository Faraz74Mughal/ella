import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

const AppSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
}: AppSelectProps) => {
  return (
    <Select
      value={value ? String(value) : undefined}
      onValueChange={(val) => onChange?.(val)}
    >
      <SelectTrigger className={`w-full max-w-48 ${className || ""}`}>
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
  );
};

export default AppSelect;