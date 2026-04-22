import { GraduationCap, Loader2, Presentation } from "lucide-react";
import RoleCard from "@/components/RoleCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useAssignRole } from "@/hooks/use-auth";

export default function SelectRolePage() {

  const { mutate: updateRole, isPending } = useAssignRole();
  const user = useAuthStore((state) => state.user);

  const handleSelect = (role: "student" | "teacher") => {
    if (!user?._id) {
      console.error("User ID is required to assign role");
      return;
    }
    updateRole({ _id: user._id, role });
  };

  
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name || "there"}
        </h1>
        <p className="text-muted-foreground">
          How would you like to use the platform?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl">
        {/* Student Card */}
        <RoleCard
          title="I want to Learn"
          description="Access courses, track your progress, and earn certificates."
          icon={<GraduationCap className="w-10 h-10 text-primary" />}
          onClick={() => handleSelect("student")}
        />

        {/* Teacher Card */}
        <RoleCard
          title="I want to Teach"
          description="Create courses, manage students, and share your expertise."
          icon={<Presentation className="w-10 h-10 text-primary" />}
          onClick={() => handleSelect("teacher")}
        />
      </div>
      {isPending && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          Setting up your workspace...
        </div>
      )}
    </div>
  );
}
