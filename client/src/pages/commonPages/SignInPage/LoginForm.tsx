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
import { Link } from "react-router";

const LoginForm = () => {
  const form = useForm({ defaultValues: { email: "", password: "" } });
  
  const {mutate:signInMutate,isPending:isSignInMutate} = useSignIn()
  

  const loginFormHandler = (values:TSignIn) => {
      signInMutate(values)

    };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(loginFormHandler)} className="space-y-4">
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
          <Link to="/forget-password" className="text-">Forget Password</Link>
        </p>

        <Button disabled={isSignInMutate} type="submit">Login</Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
