import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import StudentHeader from "@/components/student-portal/student-header";
import { TooltipProvider } from "@/components/ui/tooltip";

export const StudentPortalLayout = () => {
  // const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative flex min-h-screen flex-col bg-background max-w-[100rem] mx-auto">
        <StudentHeader />
        <main className=" ">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full  p-4  backdrop-blur-sm md:p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </TooltipProvider>
  );
};
