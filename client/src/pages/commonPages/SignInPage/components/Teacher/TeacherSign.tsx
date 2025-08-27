import React from "react";
import SignInTeacherForm from "./SignInTeacherForm";

const TeacherSign = () => {
  return (
    <>
      <div>
        <h2 className="mt-8 text-3xl font-bold text-center md:text-left">
          Welcome back
        </h2>
        <p className="mt-2 text-gray-600 text-center md:text-left">
          Sign in to continue your English journey
        </p>
      </div>
      <div className="mt-10">
        <SignInTeacherForm />
       
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href="#"
              className="w-full inline-flex justify-center py-2 px-4 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <i className="fab fa-google text-red-500 mr-2" /> Google
            </a>
            <a
              href="#"
              className="w-full inline-flex justify-center py-2 px-4 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <i className="fab fa-facebook text-blue-600 mr-2" /> Facebook
            </a>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <a
              href="#"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default TeacherSign;
