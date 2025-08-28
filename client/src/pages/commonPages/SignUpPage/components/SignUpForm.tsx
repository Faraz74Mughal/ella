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

const SignUpForm = () => {
  const form = useForm({ defaultValues: {firstName:"",lastName:"", email: "", password: "" } });

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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

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

          <div>
            <Button type="submit" className="w-full" disabled={isSignInMutate}>
              Sign Up
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default SignUpForm;
