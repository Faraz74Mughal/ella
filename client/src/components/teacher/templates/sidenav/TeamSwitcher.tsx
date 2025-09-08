
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  app
}: {
  app: {
    name: string;
  
  };
}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-2 justify-center items-center w-full py-2.5">
          {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <activeTeam.logo className="size-4" />
          </div> */}
          <div className="grid  text-left text-sm leading-tight">
            <span className="truncate text-xl font-bold">{app.name}</span>
            {/* <span className="truncate text-xs">{activeTeam.plan}2</span> */}
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
