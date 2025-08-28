import SignIn from "./components/SignIn";
const SignInPage = () => {
  console.log("LoginForm rendered");
  return (
    <div className="  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full flex flex-col md:flex-row bg-card rounded-2xl  overflow-hidden">
        <div className="w-full  py-10 px-6 sm:px-10 md:px-12 ">
          <h4
            
            className="text-primary text-2xl font-bold flex items-center justify-center md:justify-center mb-10"
          >
            <i className="fas fa-language mr-2" />
            Sign In
          </h4>
  
          <SignIn/>
        </div>
      </div>
    </div>

   
  );
};

export default SignInPage;
