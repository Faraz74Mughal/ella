import OrDivider from "@/components/common/OrDivider";
import LoginForm from "./LoginForm";
import { Link } from "react-router";
import GoogleAuth from "@/components/auth/GoogleAuth";
import FacebookAuth from "@/components/auth/FacebookAuth";
import GithubAuth from "@/components/auth/GithubAuth";
import SignInTeacherForm from "./components/Teacher/SignInTeacherForm";
import TeacherSign from "./components/Teacher/TeacherSign";
const SignInPage = () => {
  console.log("LoginForm rendered");
  return (
    <div className="  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full flex flex-col md:flex-row bg-card rounded-2xl  overflow-hidden">
        <div className="w-full  py-10 px-6 sm:px-10 md:px-12 ">
          {/* <a
            href="index.html"
            className="text-primary text-2xl font-bold flex items-center justify-center md:justify-center mb-10"
          >
            <i className="fas fa-language mr-2" />
            Task Wise
          </a> */}
          <div className="flex justify-center mb-10">
            <div className="bg-primary text-primary-foreground text-lg font-semibold px-10 py-3 rounded-s-lg text-nowrap">
              Login as a Teacher
            </div>
            {/* <div className="rounded-full p-5 bg-muted">Or</div> */}
            <div className="bg-muted text-muted-foreground text-lg font-semibold px-10 py-3 rounded-e-lg text-nowrap">
              Login as a Student
            </div>
          </div>
          <TeacherSign/>
        </div>
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
