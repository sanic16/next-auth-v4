import SigninForm from "@/components/SigninForm";
import Link from "next/link";

interface Props {
  searchParams: {
    callbackUrl: string;
  };
}

export default function SigninPage({ searchParams }: Props) {
  console.log("searchParams", searchParams);
  return (
    <div>
      <SigninForm callbackUrl={searchParams.callbackUrl} />
      <div className="text-center mt-4">
        <Link
          href="/auth/forgot-password"
          className="text-gray-400 text-sm underline"
        >
          Forgot Your Password?
        </Link>
      </div>
    </div>
  );
}
