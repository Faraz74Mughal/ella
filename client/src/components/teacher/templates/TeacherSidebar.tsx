import * as React from "react";
import { FaTachometerAlt } from "react-icons/fa";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./sidenav/TeamSwitcher";
import { NavMain } from "./sidenav/NavMain";
import { NavUser } from "./sidenav/NavUser";
import { FaBook, FaList, FaUsers } from "react-icons/fa6";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },
  app: {
    name: "Talk Wise"
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/teacher",
      icon: FaTachometerAlt
      // isActive: true,
    },
    {
      title: "Students",
      url: "/teacher/students",
      icon: FaUsers,
      
    },
    {
      title: "Lesson Management",
      url: "/teacher/lessons",
      icon: FaBook,
    },
    {
      title: "Exercise Management",
      url: "#",
      icon: FaList,
      items: [
        {
          title: "All",
          url: "/teacher/exercise/all"
        },
        {
          title: "Add",
          url: "/teacher/exercise/add"
        }
      ]
    }
  ]
};

export function TeacherSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher app={data.app} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
