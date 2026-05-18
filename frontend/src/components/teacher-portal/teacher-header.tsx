import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import CircleButtonIcon from "../ui/circle-button-icon";
import { Separator } from "../ui/separator";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";

const teacherPageTitleMap: Record<string, string> = {
  "/teacher/dashboard": "Dashboard",
  "/teacher/courses": "Courses",
  "/teacher/assignments": "Assignments",
  "/teacher/progress": "Progress",
  "/teacher/settings": "Settings",
};

export const TeacherHeader = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const pageTitle = teacherPageTitleMap[location.pathname] || "Teacher Portal";

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "TU";

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 bg-card z-30 border-b border-border/70 px-4 py-2 backdrop-blur md:px-6"
    >
      <nav className="mx-auto">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold foreground">{pageTitle}</h1>
          </div>

          <div className="flex gap-4 items-center px-2 py-1">
            <CircleButtonIcon count={6} Icon={Bell} />
            <Separator orientation="vertical" className="ml-1" />

            <Avatar size="sm">
              <AvatarImage src={user?.image} alt={user?.name || "Teacher avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4>{user?.name || "Teacher"}</h4>
              <p className="text-xs capitalize">{user?.role || "teacher"}</p>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};
