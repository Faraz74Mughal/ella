import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";

import TeacherHomePage from "@/pages/teacherPages/protectedPages/TeacherHomePage";
import { STORAGE_KEY } from "@/config";
import { jwtDecode } from "jwt-decode";
import { EUserRole } from "@/types/userType";
import AdminHomePage from "@/pages/adminPages/AdminHomePage";
import SignInPage from "@/pages/commonPages/SignInPage";
import SignUpForm from "@/pages/commonPages/SignUpPage/SignUpForm";
import VerifyUserPage from "@/pages/commonPages/VerifyUserPage";
import StudentHomePage from "@/pages/studentPages/StudentHomePage";
import GithubCodePage from "@/pages/commonPages/GithubCodePage/GithubCodePage";
import HomePage from "@/pages/commonPages/HomePage";
import CommonLayer from "@/components/layers/CommonLayer";

const checkAuth = () => {
  const getUser = localStorage.getItem(STORAGE_KEY);
  const token = getUser ? JSON.parse(getUser).token : null;
  if (!token) return null;
  try {
    return jwtDecode(token) as { role: string };
  } catch (error) {
    return null;
  }
};

const nonProtectLoader = () => () => {
  // console.log("nonProtectLoader called with redirectPath:", redirectPath);
  const user = checkAuth();
  if (user) {
    switch (user.role) {
      case EUserRole.ADMIN:
        return redirect("/admin");
      case EUserRole.TEACHER:
        return redirect("/teacher");
      case EUserRole.STUDENT:
        return redirect("/student");
      default:
        return redirect("/");
    }
  }
  return null;
};

const protectLoader = (role: string, redirectPath: string) => () => {
  console.log(
    "protectLoader called with role:",
    role,
    "and redirectPath:",
    redirectPath
  );

  const user = checkAuth();
  if (!user || user.role !== role) return redirect(redirectPath);
  return null;
};

const teacherLoader = protectLoader("teacher", "/sign-in");
const studentLoader = protectLoader("student", "/sign-in");
const notProtectLoader = nonProtectLoader();

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        loader: notProtectLoader,
        element: (
          <CommonLayer>
            <HomePage />
          </CommonLayer>
        )
      },
      {
        path: "github-code",
        Component: GithubCodePage,
        loader: notProtectLoader
      },
      {
        path: "sign-in",
        // Component: SignInPage,
        loader: notProtectLoader,
        element: (
          <CommonLayer>
            <SignInPage />
          </CommonLayer>
        )
      },
      {
        path: "sign-up",
        Component: SignUpForm,
        loader: notProtectLoader
      },
      {
        path: "verify-user",
        Component: VerifyUserPage,
        loader: notProtectLoader
      },

      {
        path: "admin",
        children: [
          {
            path: "",
            Component: AdminHomePage
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
            loader: teacherLoader
          }
        ]
      },
      {
        path: "student",
        children: [
          {
            path: "",
            Component: StudentHomePage,
            loader: studentLoader
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
