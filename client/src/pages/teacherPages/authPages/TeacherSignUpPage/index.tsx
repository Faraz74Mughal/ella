import OrDivider from "@/components/common/OrDivider";
import SignUpForm from "./SignUpForm";
import { Link } from "react-router";

const TeacherSignUpPage = () => {
  return (
    <div className="grid grid-cols-5 min-h-screen">
      <section className="hidden lg:block col-span-3">Preview HEre</section>
      <section className=" justify-center col-span-5 lg:col-span-2 w-auto text-center flex items-center px-20">
        <div className="space-y-5 lg:w-full">
          <SignUpForm />
          <OrDivider />
          <p>
            Already have an account? <Link to="/teacher/sign-in">Sign In</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default TeacherSignUpPage;
