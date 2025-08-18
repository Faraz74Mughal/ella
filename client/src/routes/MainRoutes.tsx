import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import HomePage from "../pages/studentPages/HomePage";
import SignInPage from "../pages/adminPages/SignInPage";
import TeacherSignInPage from "../pages/teacherPages/authPages/TeacherSignInPage";
import TeacherSignUpPage from "../pages/teacherPages/authPages/TeacherSignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",
        Component: HomePage
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
            path: "sign-in",
            Component: TeacherSignInPage
          },
          {
            path: "sign-up",
            Component: TeacherSignUpPage
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
