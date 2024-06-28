"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { passwordStrength } from "check-password-strength";
import { watch } from "fs";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import PasswordStrength from "./PasswordStrength";
import { Button } from "@nextui-org/button";
import { resetPassword } from "@/actions/auth";
import { toast } from "react-toastify";

interface Props {
  jwtUser: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(45, "Password must be at most 45 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const ResetPassword = ({ jwtUser }: Props) => {
  const [visiblePass, setVisiblePass] = useState(false);
  const [passStrength, setPassStrength] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const watchPassword = watch().password;
  useEffect(() => {
    setPassStrength(passwordStrength(watch("password")).id);
  }, [watchPassword, watch]);

  const resetPass: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await resetPassword(jwtUser, data.password);
      if (result === "userNotExist") toast.error("User does not exist");
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error("An error occurred while resetting the password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(resetPass)}
      className="flex flex-col w-1/2 mx-auto mt-16 gap-4 p-4 rounded-md border-2 border-gray-300 shadow-md shadow-gray-400"
    >
      <div>
        <h1 className="text-3xl font-bold">Reset Password</h1>
      </div>
      <Input
        label="Password"
        {...register("password")}
        type={visiblePass ? "text" : "password"}
        errorMessage={errors.password?.message}
        endContent={
          <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
            {visiblePass ? (
              <EyeSlashIcon className="w-5" />
            ) : (
              <EyeIcon className="w-5" />
            )}
          </button>
        }
      />
      <PasswordStrength passStrength={passStrength} />
      <Input
        label="Confirm Password"
        {...register("confirmPassword")}
        type={visiblePass ? "text" : "password"}
        errorMessage={errors.confirmPassword?.message}
        endContent={
          <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
            {visiblePass ? (
              <EyeSlashIcon className="w-5" />
            ) : (
              <EyeIcon className="w-5" />
            )}
          </button>
        }
      />
      <div className="felx justify-center">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting}
          color="primary"
          type="submit"
        >
          {isSubmitting ? "Please wait..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPassword;
