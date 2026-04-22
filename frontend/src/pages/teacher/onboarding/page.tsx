import { useForm } from "react-hook-form";
// import { useUpdateRole } from "@/hooks/use-auth"; // Your TanStack Mutation
import { FileDropzone } from "@/components/shared/file-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { useApplyTeacher } from "@/hooks/use-teacher";

export default function TeacherOnboarding() {
  const { user } = useAuthStore();
  const {mutate}  = useApplyTeacher();
  const form = useForm({
    defaultValues: {
      bio: "",
      resume: null as File | null,
      idFront: null as File | null,
      idBack: null as File | null,
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("bio", data.bio);
    if (user?._id) formData.append("userId", user._id);
    if (data.resume) formData.append("resume", data.resume);
    if (data.idFront) formData.append("idFront", data.idFront);
    if (data.idBack) formData.append("idBack", data.idBack);
      mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Complete Your Teacher Profile
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Our team will review these documents to verify your account.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Bio Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Bio</label>
              <Textarea
                placeholder="Tell students about your teaching background..."
                {...form.register("bio")}
                className="h-32"
              />
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileDropzone
                label="Upload Resume (PDF)"
                value={form.watch("resume")}
                onFileSelect={(file) => form.setValue("resume", file)}
                onRemove={() => form.setValue("resume", null)}
              />
              <div className="space-y-4">
                <FileDropzone
                  label="ID Proof (Front)"
                  value={form.watch("idFront")}
                  onFileSelect={(file) => form.setValue("idFront", file)}
                  onRemove={() => form.setValue("idFront", null)}
                />
                <FileDropzone
                  label="ID Proof (Back)"
                  value={form.watch("idBack")}
                  onFileSelect={(file) => form.setValue("idBack", file)}
                  onRemove={() => form.setValue("idBack", null)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg">
              Submit for Approval
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
