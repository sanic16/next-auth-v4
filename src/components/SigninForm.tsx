"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface Props {
  callbackUrl?: string;
}

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

type InputType = z.infer<typeof FormSchema>;

const SigninForm = (props: Props) => {
  const router = useRouter();
  const [visiblePass, setVisiblePass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const onsubmit: SubmitHandler<InputType> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.email,
      password: data.password,
    });
    if (result && !result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Signed in successfully");
    console.log("callbackUrl", props.callbackUrl);
    router.push(props.callbackUrl ? props.callbackUrl : "/");
  };

  return (
    <form
      className="flex flex-col gap-8 p-4 border rounded w-1/2 mx-auto mt-16"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div>
        <h1 className="text-4xl font-bold">Sign In</h1>
      </div>
      <Input
        label="Email"
        {...register("email")}
        placeholder="john@email.com"
        errorMessage={errors.email?.message}
      />
      <Input
        label="password"
        {...register("password")}
        type={visiblePass ? "text" : "password"}
        errorMessage={errors.password?.message}
        endContent={
          <button onClick={() => setVisiblePass(!visiblePass)} type="button">
            {visiblePass ? (
              <EyeSlashIcon className="w-5" />
            ) : (
              <EyeIcon className="w-5" />
            )}
          </button>
        }
      />
      <div className="flex items-center justify-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Signin in..." : "Sign in"}
        </Button>
        <Button as={Link} href="/auth/signup">
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default SigninForm;
