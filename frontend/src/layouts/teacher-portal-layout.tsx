import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { TeacherHeader } from "@/components/teacher-portal/teacher-header";
import { TeacherSidebar } from "@/components/teacher-portal/teacher-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const TeacherPortalLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SidebarProvider>
        <TeacherSidebar />
        <main className="flex-1">
          <TeacherHeader />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full border border-border/70 p-4 shadow-sm backdrop-blur-sm md:p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </SidebarProvider>
    </div>
  );
};
