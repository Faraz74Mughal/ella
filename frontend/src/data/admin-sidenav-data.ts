import { BookText, ClipboardList, LayoutDashboard, MessageCircle, Newspaper, Settings, Users } from "lucide-react";

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
    {
      icon: ClipboardList,
      label: "Assignments",
      to: "/admin/assignments",
    },
    {
      icon: MessageCircle,
      label: "Discussions",
      to: "/admin/discussions",
    },
    {
      icon: Settings,
      label: "Discussion Categories",
      to: "/admin/discussion-categories",
    },
];

export default adminSidebarData;
