import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  ClipboardList,
  MessageCircle,
  MessagesSquare,
  LayoutDashboard,
  Trophy,
  TrendingUp,
  User,
  Award,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/student/dashboard" },
  { label: "My Lessons", icon: BookOpen, to: "/student/lessons" },
  { label: "Assignments", icon: ClipboardList, to: "/student/assignments" },
  { label: "Peer Chat", icon: MessagesSquare, to: "/student/chat" },
  { label: "Discussions", icon: MessageCircle, to: "/student/discussions" },
  { label: "Achievements", icon: Award, to: "/student/achievements" },
  { label: "Leaderboard", icon: Trophy, to: "/student/leaderboard" },
  { label: "Progress", icon: TrendingUp, to: "/student/progress" },
];

const StudentSidebar = () => {
  const { pathname } = useLocation();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 bg-card!">
        <div className="flex items-center gap-3 text-indigo-600">
          <BookOpen size={24} strokeWidth={2.5} />
          <span className="font-bold text-xl group-data-[collapsible=icon]:hidden">
            LingoQuest
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card! px-2!">
        <SidebarGroup className="px-0!">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                isActive={pathname === item.to}
              >
                <NavLink
                  to={item.to}
                  className={`flex items-center w-full gap-3 px-6! py-5! rounded-xl transition-all duration-200
                ${
                  pathname === item.to
                    ? "bg-indigo-600! text-white! shadow-indigo-200 shadow-lg"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
                >
                  <item.icon size={18} />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-card!">
        {/* Profile Section */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/student/profile" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <User size={16} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Alex Student</span>
                  <span className="truncate text-xs opacity-70">
                    Basic Plan
                  </span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSidebar;
