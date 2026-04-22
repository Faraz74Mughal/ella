import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FormInput } from "@/components/ui/form-input";
import { FormMedia, type MediaType } from "@/components/ui/form-media";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import {
  CATEGORY,
  LEVEL,
  STUDY_MATERIAL_TYPE,
} from "@/constants/lesson.constant";
import type { ILesson } from "@/types/lesson";
import { optionsOfObject } from "@/utils/options";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface LessonFormProps {
  onSubmit: (values: ILesson) => Promise<void>;
  isLoading: boolean;
  lesson?: ILesson | null | undefined;
}

const LessonForm = ({ onSubmit, isLoading, lesson }: LessonFormProps) => {
  const form = useForm<ILesson>({
    defaultValues: {
      title: "",
      level: "",
      category: "",
      study_material: {
        content: "",
        material_type: "",
      },
      is_published: false,
    },
  });

  const materialType = form.watch("study_material.material_type");

  useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title || "",
        level: lesson.level || "",
        category: lesson.category || "",
        study_material: {
          content: lesson.study_material?.content || "",
          material_type: lesson.study_material?.material_type || "",
        },
        is_published: lesson.is_published || false,
      });
    }
  }, [lesson, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* TOP SECTION */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              control={form.control}
              label="Title"
              name="title"
              disabled={isLoading}
              placeholder="Enter lesson title..."
            />

            <FormSelect
              control={form.control}
              label="Category"
              name="category"
              disabled={isLoading}
              placeholder="Select category"
              options={optionsOfObject(CATEGORY)}
            />

            <FormSelect
              control={form.control}
              label="Level"
              name="level"
              disabled={isLoading}
              placeholder="Select level"
              options={optionsOfObject(LEVEL)}
            />
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">
            Content Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              control={form.control}
              label="Content Type"
              name="study_material.material_type"
              disabled={isLoading}
              placeholder="Select type"
              options={optionsOfObject(STUDY_MATERIAL_TYPE)}
            />
          </div>

          <div className="mt-6">
            {materialType === "audio" || materialType === "video" ? (
              <FormMedia
                control={form.control}
                label="Media Content"
                name="study_material.content"
                type={(materialType as MediaType) || "image"}
              />
            ) : (
              <FormTextarea
                control={form.control}
                label="Content"
                name="study_material.content"
                disabled={isLoading}
                rows={12}
              />
            )}
          </div>
        </div>

        {/* PUBLISH SECTION */}
        <div className="flex items-center justify-between pt-4 border-t">
          <FormCheckbox
            control={form.control}
            label="Publish immediately"
            name="is_published"
            disabled={isLoading}
          />

          <Button type="submit" disabled={isLoading} className="px-6">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {lesson ? "Update Lesson" : "Create Lesson"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LessonForm;
