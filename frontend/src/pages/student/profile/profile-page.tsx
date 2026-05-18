import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { authService } from "@/api/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

type ProfileForm = {
  name: string;
  username: string;
  contactNo: string;
  language: string;
  dob: string;
  bio: string;
};

const buildInitialForm = (user: any): ProfileForm => ({
  name: user?.name || "",
  username: user?.username || "",
  contactNo: user?.contactNo || "",
  language: user?.language || "",
  dob: user?.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
  bio: user?.bio || "",
});

const StudentProfilePage = () => {
  const { user, setAuth } = useAuthStore();
  const [form, setForm] = useState<ProfileForm>(buildInitialForm(user));
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    setForm(buildInitialForm(user));
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateCurrentUser,
    onSuccess: (updatedUser) => {
      setAuth(updatedUser);
      toast.success("Profile updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "Failed to update profile.";
      toast.error(message);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: authService.uploadCurrentUserAvatar,
    onSuccess: (updatedUser) => {
      setAuth(updatedUser);
      setAvatarFile(null);
      toast.success("Profile image uploaded successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "Failed to upload image.";
      toast.error(message);
    },
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your profile information and update your details.
        </p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="Username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email || ""} disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Number</label>
            <Input
              value={form.contactNo}
              onChange={(e) => setForm((prev) => ({ ...prev, contactNo: e.target.value }))}
              placeholder="e.g. +8801XXXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Language</label>
            <Input
              value={form.language}
              onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
              placeholder="e.g. English"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => setForm((prev) => ({ ...prev, dob: e.target.value }))}
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-sm font-medium">Profile Image</label>
            {user?.image && (
              <img
                src={user.image}
                alt="Profile"
                className="h-20 w-20 rounded-full border object-cover"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={!avatarFile || uploadAvatarMutation.isPending}
                onClick={() => {
                  if (avatarFile) {
                    uploadAvatarMutation.mutate(avatarFile);
                  }
                }}
              >
                {uploadAvatarMutation.isPending ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself"
              className="min-h-32"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => updateProfileMutation.mutate(form)}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StudentProfilePage;