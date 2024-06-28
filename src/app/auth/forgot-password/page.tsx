"use client";

import { forgotPassword } from "@/actions/auth";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type InputType = z.infer<typeof FormSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const submitRequest: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await forgotPassword(data.email);
      toast.success("Email sent successfully");
    } catch (error) {
      toast.error("An error occurred while sending the email");
    } finally {
      reset();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 place-items-center mt-16 p-8">
      <form
        onSubmit={handleSubmit(submitRequest)}
        className="flex flex-col gap-2 p-2 border rounded-md shadow w-full"
      >
        <div>
          <h1 className="text-center p-2">Forgot Password</h1>
        </div>
        <Input
          label="Email"
          {...register("email")}
          startContent={<EnvelopeIcon className="w-5" />}
          errorMessage={errors.email?.message}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </form>
      <Image
        src="/forgotPass.png"
        alt="Forgot Password"
        width={500}
        height={500}
        className="col-span-2"
      />
    </div>
  );
}
