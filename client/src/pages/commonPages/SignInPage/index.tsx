import OrDivider from "@/components/common/OrDivider";
import LoginForm from "./LoginForm";
import { Link } from "react-router";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa6";

const SignInPage = () => {
  console.log("LoginForm rendered");
  return (
    <div className="grid grid-cols-5 min-h-screen">
      <section className="hidden lg:block col-span-3">Preview HEre</section>
      <section className=" justify-center col-span-5 lg:col-span-2 w-auto text-center flex items-center px-20">
        <div className="space-y-5 lg:w-full">
          <h2 className="text-4xl font-bold">Welcome</h2>
          <p className="text-accent-foreground">Please Login To Teacher Dashboard</p>
          <LoginForm />
          <OrDivider />
          <p>
            Don't have an account? <Link to="/sign-up">Sign Up</Link>
          </p>
          <OrDivider />
          <div className="flex gap-4 justify-center">
            <FaFacebook/>
            <FaTwitter/>
            <FaGoogle/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignInPage;
