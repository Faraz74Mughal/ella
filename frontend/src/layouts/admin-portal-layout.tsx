import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";


import { AdminHeader } from "@/components/admin-portal/admin-header";
import { AdminSidebar } from "@/components/admin-portal/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const AdminPortalLayout = () => {
  // const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 " />
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 ">
          <AdminHeader />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full  border border-border/70  p-4 shadow-sm backdrop-blur-sm md:p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </SidebarProvider>
    </div>
  );
};
