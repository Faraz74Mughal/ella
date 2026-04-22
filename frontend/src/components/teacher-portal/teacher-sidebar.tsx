import { BookOpenText, Gauge, LineChart, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../shared/theme-toggle";

const teacherNavItems = [
  { label: "Dashboard", to: "/teacher/dashboard", icon: Gauge },
  { label: "Courses", to: "/teacher/courses", icon: BookOpenText },
  { label: "Progress", to: "/teacher/progress", icon: LineChart },
  { label: "Settings", to: "/teacher/settings", icon: Settings },
];

interface TeacherSidebarProps {
  onNavigate?: () => void;
}

export const TeacherSidebar = ({ onNavigate }: TeacherSidebarProps) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full flex-col border-r border-border/70 bg-linear-to-b from-background to-muted/40 px-3 py-5"
    >
      <div className="mb-8 px-3">
        <h2 className="text-lg font-semibold text-foreground">Teacher Portal</h2>
        <p className="text-xs text-muted-foreground">Manage your classes and outcomes</p>
      </div>

      <nav className="space-y-2">
        {teacherNavItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.06 * index }}
            >
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

        <div className="mt-auto px-3 pt-6">
          <ThemeToggle />
        </div>
    </motion.aside>
  );
};
