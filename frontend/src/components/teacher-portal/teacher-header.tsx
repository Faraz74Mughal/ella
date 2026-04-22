import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";

interface TeacherHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TeacherHeader = ({ onOpenMobileMenu }: TeacherHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "TU";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-30 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur md:px-6"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
          >
            <Menu className="size-4" />
          </Button>
          <div>
            <p className="text-sm font-semibold">Teacher Workspace</p>
            <p className="text-xs text-muted-foreground">Plan, track and improve student outcomes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-2.5 py-1.5 sm:flex">
            <Avatar size="sm">
              <AvatarImage src={user?.image} alt={user?.name || "Teacher avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium text-foreground">{user?.name || "Teacher User"}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
