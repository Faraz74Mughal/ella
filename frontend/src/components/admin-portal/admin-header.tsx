import { motion } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import CircleButtonIcon from "../ui/circle-button-icon";
import { Bell } from "lucide-react";
import { Separator } from "../ui/separator";
import { imageFallback, pageHeadingManagement } from "@/utils/heplers";
import {useLocation} from  "react-router-dom"
import AvatarCircle from "../ui/avatar-circle";

export const AdminHeader = () => {
  
  const { user } = useAuthStore();

 const location = useLocation()

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 bg-card z-30 border-b border-border/70 px-4 py-2 backdrop-blur md:px-6"
    >
      <nav className=" mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold foreground"> {pageHeadingManagement(location.pathname)}</h1>
          <div className="flex gap-4 items-center px-2 py-1">
            <CircleButtonIcon count={20} Icon={Bell}  />
            <Separator orientation="vertical" className="ml-1"/>
            
            <AvatarCircle src={user?.image} name={user?.name}/>
            <div className="flex flex-col">
              <h4>{user?.name}</h4>
              <p className="text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};
