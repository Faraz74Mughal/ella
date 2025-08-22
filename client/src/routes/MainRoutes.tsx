import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";

import TeacherHomePage from "@/pages/teacherPages/protectedPages/TeacherHomePage";
import { STORAGE_KEY } from "@/config";
import {jwtDecode} from "jwt-decode"
import { EUserRole } from "@/types/userType";
import AdminHomePage from "@/pages/adminPages/AdminHomePage";
import SignInPage from "@/pages/commonPages/SignInPage";
import SignUpForm from "@/pages/commonPages/SignUpPage/SignUpForm";
import VerifyUserPage from "@/pages/commonPages/VerifyUserPage";

const checkAuth =()=>{
  const user = localStorage.getItem(STORAGE_KEY)
  if(!user)    return null
  try {
    return jwtDecode(user) as {role:string}
  } catch (error) {
    return null
  }
  
}

const nonProtectLoader = () =>()=>{
  // console.log("nonProtectLoader called with redirectPath:", redirectPath);
const user = checkAuth();
  if(user){
    switch(user.role){
      case EUserRole.ADMIN:
        return redirect("/admin")
        case EUserRole.TEACHER:
          return redirect("/teacher")
        case EUserRole.STUDENT:
          return redirect("/student")
        default:  
          return redirect("/")
    }
  }
    return null
  }
   


const protectLoader =(role:string,redirectPath:string)=>()=>{
  console.log("protectLoader called with role:", role, "and redirectPath:", redirectPath)

  const user = checkAuth()
  if(!user||user.role !==role) return redirect(redirectPath)
  return null  
}

const teacherLoader = protectLoader("teacher", "/sign-in");
const notProtectLoader = nonProtectLoader();

const router = createBrowserRouter([
  {
    path: "/",
    children: [
       {
            path: "sign-in",
            Component: SignInPage,
            loader:notProtectLoader
          },
          {
            path: "sign-up",
            Component: SignUpForm,
            loader:notProtectLoader
          },
          {
            path: "verify-user",
            Component: VerifyUserPage,
            loader:notProtectLoader
          },
      

      {
        path: "admin",
        children: [
          {
            path: "",
            Component: AdminHomePage,
          },
          {
            path: "sign-in",
            Component: SignInPage
          }
        ]
      },
      {
        path: "teacher",
        children: [
          {
            path: "",
            Component: TeacherHomePage,
            loader:teacherLoader
          },
         
        ]
      }
    ]
  }
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
