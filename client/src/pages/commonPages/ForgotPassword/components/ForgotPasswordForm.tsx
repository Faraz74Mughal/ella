import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { createNewPasswordSchema } from "@/schemaValidations/common/createNewPassword.schema copy";
import { useCreateNewPasswordEmail } from "@/services/queries/teacherQueries/auth.queries";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";

type TValues = {
  confirmPassword: string;
  newPassword: string;
};

const ForgotPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
  }, [token, navigate]);

  const form = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: yupResolver(createNewPasswordSchema)
  });

  const { mutate: createNewPasswordEmailMutate, isPending: isSignInMutate } =
    useCreateNewPasswordEmail();

  const formHandler = (values: TValues) => {
    createNewPasswordEmailMutate(
      { ...values, token: token || "" },
      {
        onSuccess: (response) => {
          if (response.success) navigate("/sign-in");
        }
      }
    );
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(formHandler)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter your new password"
                    {...field}
                  />
                </FormControl>
                {form.formState.errors["newPassword"] && (
                  <FormDescription className="text-destructive">
                    {form.formState.errors["newPassword"].message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter your confirm password"
                    {...field}
                  />
                </FormControl>
                {form.formState.errors["confirmPassword"] && (
                  <FormDescription className="text-destructive">
                    {form.formState.errors["confirmPassword"].message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" className="w-full" disabled={isSignInMutate}>
              Update Password
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default ForgotPasswordForm;
