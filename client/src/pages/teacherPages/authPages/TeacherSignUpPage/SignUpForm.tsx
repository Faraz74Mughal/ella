import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useSignUp } from "@/services/queries/teacherQueries/auth.queries";
import { TSignUp } from "@/types/userType";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router";

const initialValue: TSignUp = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
};

const SignUpForm = () => {
  const form = useForm({ defaultValues: initialValue });

  const { mutate: signUpMutate, data: signUpData } = useSignUp();
  console.log("signUpData", signUpData);

  const loginFormHandler = (values: TSignUp) => {
    signUpMutate(values);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(loginFormHandler)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your First Name" {...field} />
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
                <Input placeholder="Enter your Last Name" {...field} />
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
        <p>
          <Link to="/teacher/forget-password" className="text-">
            Forget Password
          </Link>
        </p>

        <Button type="submit">Sign Up</Button>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
