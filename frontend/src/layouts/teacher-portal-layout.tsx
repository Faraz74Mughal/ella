import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TeacherHeader } from "@/components/teacher-portal/teacher-header";
import { TeacherSidebar } from "@/components/teacher-portal/teacher-sidebar";
import { TeacherFooter } from "@/components/teacher-portal/teacher-footer";

export const TeacherPortalLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_44%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.08),transparent_48%)]" />

      <TeacherHeader onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <aside className="hidden w-72 lg:block">
          <TeacherSidebar />
        </aside>

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-[84%] max-w-sm p-0" showCloseButton>
            <SheetHeader className="border-b border-border/70">
              <SheetTitle>Teacher Navigation</SheetTitle>
            </SheetHeader>
            <TeacherSidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full rounded-2xl border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur-sm md:p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <TeacherFooter />
    </div>
  );
};
