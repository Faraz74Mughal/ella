import { useFetchCurrentUser } from "@/services/queries/teacherQueries/user.queries";
import { TeacherSidebar } from "../teacher/templates/TeacherSidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { SiteHeader } from "../teacher/templates/sidenav/SiteHeader";
import TeacherBreadCrumb from "../teacher/templates/breadCrumb/TeacherBreadCrumb";

const TeacherLayer = ({
  children,
  breadCrumb,
  title
}: {
  children: React.ReactNode;
  breadCrumb?: { title: string; link?: string }[];
  title: string;
}) => {
  const { data: currentUserData } = useFetchCurrentUser();
  const { setCurrentUser } = useUserStore();
  useEffect(() => {
    if (currentUserData) {
      console.log("currentUserData", currentUserData);
      setCurrentUser(currentUserData.data);
    }
  }, [currentUserData, setCurrentUser]);

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="p-5 space-y-5">
          {breadCrumb ? <TeacherBreadCrumb breadCrumb={breadCrumb} /> : null}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherLayer;
