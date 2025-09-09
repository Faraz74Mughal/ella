import { Button } from "@/components/ui/button";
import FiledSelect from "@/components/ui/FiledSelect";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { ECategory, ELevel } from "@/types/lessonInterface";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

const LessonForm = () => {
  const levelOptions = useMemo(
    () =>
      Object.entries(ELevel).map(([key, value]) => ({
        label: key,
        value: value
      })),
    []
  );

    const categoryOptions = useMemo(
    () =>
      Object.entries(ECategory).map(([key, value]) => ({
        label: key,
        value: value
      })),
    []
  );

  const form = useForm();
  const formHandler = async () => {};
  return (
    <form>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(formHandler)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  {/* {form.formState.errors["title"] && (
                  <FormDescription className="text-destructive">
                    {form.formState.errors["title"].message}
                  </FormDescription>
                )} */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  {form.formState.errors["description"] && (
                    <FormDescription className="text-destructive">
                      {/* {form.formState.errors["description"].message} */}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FiledSelect form={form} name="level" title="Level" options={levelOptions} />
            <FiledSelect form={form} name="category" title="Category" options={categoryOptions} />
            <RichTextEditor form={form} />
          </div>

          <div>
            <Button type="submit" className="w-full">
             Create
            </Button>
          </div>
        </form>
      </FormProvider>
    </form>
  );
};

export default LessonForm;
