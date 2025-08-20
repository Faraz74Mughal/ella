import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";

import HomePage from "../pages/studentPages/HomePage";
import SignInPage from "../pages/adminPages/SignInPage";
import TeacherSignInPage from "../pages/teacherPages/authPages/TeacherSignInPage";
import TeacherSignUpPage from "../pages/teacherPages/authPages/TeacherSignUpPage";
import TeacherVerifyUserPage from "@/pages/teacherPages/authPages/TeacherVerifyUserPage";
import TeacherHomePage from "@/pages/teacherPages/protectedPages/TeacherHomePage";
import { STORAGE_KEY } from "@/config";
import {jwtDecode} from "jwt-decode"

const nonProtectLoader = ( redirectPath: string) => {
  return () => {
    const user = localStorage.getItem(STORAGE_KEY);
    if (user) {
        return redirect(redirectPath);
    }
   
    return null;
  };
};

const protectLoader =(role:string,redirectPath:string)=>()=>{
  const user = localStorage.getItem(STORAGE_KEY);
  
  if (!user )    return redirect(redirectPath);
  try {
    
    if(user){
      const decodeUser = jwtDecode(user);
      if((decodeUser as {role:string}).role !== role)return redirect(redirectPath);
    }
  } catch (error) {
    return redirect(redirectPath);
  }
return null   
}

const teacherLoader = protectLoader("teacher", "/teacher/sign-in");
const notProtectLoader = nonProtectLoader( "/teacher");

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",
        Component: HomePage,
       
      },

      {
        path: "admin",
        children: [
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
          {
            path: "sign-in",
            Component: TeacherSignInPage,
            loader:notProtectLoader
          },
          {
            path: "sign-up",
            Component: TeacherSignUpPage,
            loader:notProtectLoader
          },
          {
            path: "verify-user",
            Component: TeacherVerifyUserPage,
            loader:notProtectLoader
          }
        ]
      }
    ]
  }
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
