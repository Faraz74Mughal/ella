import { Link } from "react-router";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPassword = () => {
  
  return (
    <div className="  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full flex flex-col md:flex-row bg-card rounded-2xl  overflow-hidden">
        <div className="w-full  py-10 px-6 sm:px-10 md:px-12 ">
          <h4 className="text-primary text-2xl font-bold flex items-center justify-center md:justify-center mb-5">
            <i className="fas fa-language mr-2" />
            Create New Password
          </h4>
          <p className="mb-10 mt-2 text-gray-600 text-center md:text-center">
           Create your new password!
          </p>
          <ForgotPasswordForm />
          <div className="text-center mt-5">
            <Link to="/sign-in" className="text-sm text-muted-foreground"> Back to Sign-In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
