import ResetPassword from "@/components/ResetPassword";
import { verifyJwt } from "@/lib/jwt";

interface Props {
  params: {
    jwt: string;
  };
}

export default function ResetPasswordPage({ params }: Props) {
  const payload = verifyJwt(params.jwt);
  if (!payload)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        The URL is not valid!
      </div>
    );
  return (
    <div>
      <ResetPassword jwtUser={params.jwt} />
    </div>
  );
}
