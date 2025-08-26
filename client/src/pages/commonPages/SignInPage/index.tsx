import OrDivider from "@/components/common/OrDivider";
import LoginForm from "./LoginForm";
import { Link } from "react-router";
import GoogleAuth from "@/components/auth/GoogleAuth";
import FacebookAuth from "@/components/auth/FacebookAuth";
import GithubAuth from "@/components/auth/GithubAuth";
const SignInPage = () => {
  console.log("LoginForm rendered");
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full flex flex-col md:flex-row bg-white rounded-2xl  overflow-hidden">
        <div className="w-full  py-10 px-6 sm:px-10 md:px-12">
          <div>
            <a
              href="index.html"
              className="text-primary text-2xl font-bold flex items-center justify-center md:justify-start"
            >
              <i className="fas fa-language mr-2" />
              Task
            </a>
            <h2 className="mt-8 text-3xl font-bold text-center md:text-left">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-600 text-center md:text-left">
              Sign in to continue your English journey
            </p>
          </div>
          <div className="mt-10">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field py-3 px-4 block w-full rounded-lg border border-gray-300 focus:outline-none"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input-field py-3 px-4 block w-full rounded-lg border border-gray-300 focus:outline-none"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg  text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                >
                  Sign in
                </button>
              </div>
            </form>
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
        </div>
        {/* Right side - App Preview */}
      </div>
    </div>

    // <div className="grid grid-cols-5 min-h-screen">
    //   <section className="hidden lg:block col-span-3">Preview HEre</section>
    //   <section className=" justify-center col-span-5 lg:col-span-2 w-auto text-center flex items-center px-20">
    //     <div className="space-y-5 lg:w-full">
    //       <h2 className="text-4xl font-bold">Welcome</h2>
    //       <p className="text-accent-foreground">Please Login To Teacher Dashboard</p>
    //       <LoginForm />
    //       <OrDivider />
    //       <p>
    //         Don't have an account? <Link to="/sign-up">Sign Up</Link>
    //       </p>
    //       <OrDivider />
    //       <div className="flex gap-4 justify-center">
    //         <GoogleAuth/>
    //         <FacebookAuth/>
    //         <GithubAuth/>
    //       </div>
    //     </div>
    //   </section>
    // </div>
  );
};

export default SignInPage;
