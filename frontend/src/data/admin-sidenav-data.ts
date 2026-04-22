import {  BookText, LayoutDashboard, Newspaper, Users } from "lucide-react";

const adminSidebarData = [
  {
    icon: LayoutDashboard,
    label: "Dashboard Overview",
    to: "/admin/dashboard",
  },
  {
    icon: Users,
    label: "Users Management",
    to: "/admin/users",
  },
   {
    icon: BookText,
    label: "Lessons Management",
    to: "/admin/lessons",
  },
    {
    icon: Newspaper,
    label: "Exercises Management",
    to: "/admin/exercises",
  },
];

export default adminSidebarData;
