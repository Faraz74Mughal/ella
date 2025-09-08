/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select";

import { UseFormReturn } from "react-hook-form";

const FiledSelect = ({
  form,
  title,
  name,
  options
}: {
  form: UseFormReturn<any>;
  title: string;
  name: string;
  options: { label: string; value: string }[];
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{title}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors[name] && (
            <FormDescription className="text-destructive">
              {typeof form.formState?.errors?.[name]?.message === "string"
                ? form.formState.errors[name].message
                : ""}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};

export default FiledSelect;
