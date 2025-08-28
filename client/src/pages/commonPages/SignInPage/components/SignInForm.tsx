import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useSignIn } from "@/services/queries/teacherQueries/auth.queries";
import { TSignIn } from "@/types/userType";
import { FormProvider, useForm } from "react-hook-form";

const SignInForm = () => {
  const form = useForm({ defaultValues: { email: "", password: "" } });

  const { mutate: signInMutate, isPending: isSignInMutate } = useSignIn();

  const loginFormHandler = (values: TSignIn) => {
    signInMutate(values);
  };

  return (
    <>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(loginFormHandler)}
          className="space-y-6"
        >
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
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
            <Button
              type="submit"
              className="w-full"
              disabled={isSignInMutate}
              
            >
              Sign in
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default SignInForm;
