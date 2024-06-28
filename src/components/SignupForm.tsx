"use client";

import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import validator from "validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/actions/auth";
import { toast } from "react-toastify";

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(45, "First name must be at most 45 characters")
      .regex(
        new RegExp("^[a-zA-Z]{3,45}$"),
        "First name must contain only letters"
      ),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(45, "Last name must be at most 45 characters")
      .regex(
        new RegExp("^[a-zA-Z]{3,45}$"),
        "Last name must contain only letters"
      ),
    email: z.string().email("Please enter a valid email"),
    // phone: z.string().regex(new RegExp("^\\+502\\d{4}\\d{4}$")),
    phone: z
      .string()
      .refine(validator.isMobilePhone, "Please entere a valid phone number!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(45, "Password must be at most 45 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(45, "Password must be at most 45 characters"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept all terms",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const [passStrength, setPassStrength] = useState(0);
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  const watchPassword = watch().password;
  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch, watchPassword]);

  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<InputType> = async (data) => {
    const { accepted, confirmPassword, firstName, lastName, ...user } = data;
    try {
      const result = await registerUser({
        firstname: firstName,
        lastname: lastName,
        ...user,
      });
      toast.success("User registered successfully");
    } catch (error) {
      toast.error("An error occurred while registering the user");
    }
  };

  return (
    <form
      className="grid grid-cols-2 gap-3 p-4 shadow  place-self-stretch"
      onSubmit={handleSubmit(saveUser)}
    >
      <Input
        errorMessage={errors.firstName?.message}
        isInvalid={!!errors.firstName}
        label="First Name"
        placeholder="John Doe"
        startContent={<UserIcon className="w-5" />}
        {...register("firstName")}
      />
      <Input
        errorMessage={errors.lastName?.message}
        isInvalid={!!errors.lastName}
        label="Last Name"
        placeholder="Doe"
        startContent={<UserIcon className="w-5" />}
        {...register("lastName")}
      />
      <Input
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        label="Email"
        placeholder="john@email.com"
        startContent={<EnvelopeIcon className="w-5" />}
        className="col-span-2"
        {...register("email")}
      />
      <Input
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
        label="Phone"
        placeholder="+502 1234 5678"
        startContent={<PhoneIcon className="w-5" />}
        className="col-span-2"
        {...register("phone")}
      />
      <Input
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        label="Password"
        type={isVisiblePass ? "text" : "Password"}
        startContent={<KeyIcon className="w-5" />}
        className="col-span-2"
        endContent={
          isVisiblePass ? (
            <EyeSlashIcon
              className="w-5 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          ) : (
            <EyeIcon
              className="w-5 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          )
        }
        {...register("password")}
      />
      <PasswordStrength passStrength={passStrength} />
      <Input
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
        label="Confirm Password"
        type={isVisiblePass ? "text" : "Password"}
        startContent={<KeyIcon className="w-5" />}
        className="col-span-2"
        {...register("confirmPassword")}
      />
      <Controller
        control={control}
        name="accepted"
        render={({ field }) => (
          <Checkbox
            className="col-span-2"
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            Accept The <Link href="/terms">Terms</Link>
          </Checkbox>
        )}
      />

      {!!errors.accepted && (
        <p className="text-red-500">{errors.accepted.message}</p>
      )}

      <div className="flex justify-center col-span-2">
        <Button type="submit" color="primary" className="w-48">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
