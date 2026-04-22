import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
} from "lucide-react";

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
import { ThemeToggle } from "../shared/theme-toggle";
import { useAuthStore } from "@/store/useAuthStore";
import adminSidebarData from "@/data/admin-sidenav-data";


export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center h-16 px-4 ">
          <span className="text-white font-bold text-xl">LangLearn Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {adminSidebarData.map((item) => (
            <SidebarMenuItem key={item.label}>
              <NavLink
                to={item.to}
                // onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center text-white gap-2 w-full rounded-md p-2 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-sidebar-accent "
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:"
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
            <SidebarMenuButton onClick={handleLogout} className="text-white!">
              <LogOut /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    // <motion.aside
    //   initial={{ opacity: 0, x: -24 }}
    //   animate={{ opacity: 1, x: 0 }}
    //   transition={{ duration: 0.35 }}
    //   className="h-full border-r border-border/70 bg-gradient-to-b from-background via-background to-muted/40 px-3 py-5"
    // >
    //   <div className="mb-8 rounded-2xl border border-border/70 bg-card/80 px-4 py-4 shadow-sm backdrop-blur">
    //     <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
    //       Admin Console
    //     </p>
    //     <h2 className="mt-2 text-lg font-semibold text-foreground">Platform Control</h2>
    //     <p className="mt-1 text-xs leading-5 text-muted-foreground">
    //       Manage users, approvals, and operational settings from one place.
    //     </p>
    //   </div>

    //   <nav className="space-y-2">
    //     {adminNavItems.map((item, index) => {
    //       const Icon = item.icon;
    //       return (
    //         <motion.div
    //           key={item.to}
    //           initial={{ opacity: 0, x: -16 }}
    //           animate={{ opacity: 1, x: 0 }}
    //           transition={{ duration: 0.25, delay: 0.06 * index }}
    //         >
    //           <NavLink
    //             to={item.to}
    //             onClick={onNavigate}
    //             className={({ isActive }) =>
    //               cn(
    //                 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    //                 isActive
    //                   ? "bg-primary text-primary-foreground shadow-sm"
    //                   : "text-muted-foreground hover:bg-muted hover:text-foreground"
    //               )
    //             }
    //           >
    //             <Icon className="size-4" />
    //             <span>{item.label}</span>
    //           </NavLink>
    //         </motion.div>
    //       );
    //     })}
    //   </nav>
    // </motion.aside>
  );
};
