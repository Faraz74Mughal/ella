import SignInForm from "./SignInForm";
import GoogleAuth from "@/components/auth/GoogleAuth";
import FacebookAuth from "@/components/auth/FacebookAuth";
import { Link } from "react-router";

const SignIn = () => {
  

  return (
    <>
      <div>
        <h2 className="mt-8 text-3xl font-bold text-center md:text-center">
          Welcome back
        </h2>
        <p className="mt-2 text-gray-600 text-center md:text-center">
          Sign in to continue your English journey
        </p>
      </div>
      <div className="mt-10">
        <SignInForm />

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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 relative">
           <GoogleAuth/>
           <FacebookAuth/>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              to="/sign-up"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
