import {  ClipboardList, Gauge, LogOut, MessageCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../shared/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";

const teacherNavItems = [
  { label: "Dashboard", to: "/teacher/dashboard", icon: Gauge },
  { label: "Assignments", to: "/teacher/assignments", icon: ClipboardList },
  { label: "Discussions", to: "/teacher/discussions", icon: MessageCircle },
];

interface TeacherSidebarProps {
  onNavigate?: () => void;
}

export const TeacherSidebar = ({ onNavigate }: TeacherSidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar className="**:data-[sidebar=sidebar-inner]:bg-indigo-700">
      <SidebarHeader>
        <div className="flex items-center justify-center h-16 px-4">
          <span className="text-white font-bold text-xl">LangLearn Teacher</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {teacherNavItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center text-white gap-2 w-full rounded-md p-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-500"
                      : "hover:bg-indigo-600"
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ThemeToggle />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-white! hover:bg-indigo-600!">
              <LogOut /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
