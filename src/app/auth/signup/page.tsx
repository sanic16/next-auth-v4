import SignupForm from "@/components/SignupForm";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

export default function SignUpPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center items-center gap-3 w-2/3 mx-auto border border-gray-400 border-dashed rounded-md p-4 mt-6">
      <div className="md:col-span-2 flex justify-center items-center">
        <p className="text-center p-2">Already Signed up?</p>
        <Link href="/auth/signin">Sign In</Link>
      </div>
      <SignupForm />
      <Image src="/login.png" alt="Login Form" width={500} height={500} />
    </div>
  );
}
