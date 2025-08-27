import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TSignIn } from "@/types/userType";
import { FormProvider, useForm } from "react-hook-form";

const SignInTeacherForm = () => {

 const form = useForm({ defaultValues: { email: "", password: "" } });
   
   const {mutate:signInMutate,isPending:isSignInMutate} = useSignIn()
   
 
   const loginFormHandler = (values:TSignIn) => {
       signInMutate(values)
 
     };

  return (
    <>
    <FormProvider {...form}>
       <form onSubmit={form.handleSubmit(loginFormHandler)} className="space-y-6">
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
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
        {/* <div className="flex items-center">
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
        </div> */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg  text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
          >
            Sign in
          </button>
        </div>
      </form>
      </FormProvider>
    </>
  );
};

export default SignInTeacherForm;
