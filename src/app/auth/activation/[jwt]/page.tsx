import { activateUser } from "@/actions/auth";

export default async function ActivationPage({
  params,
}: {
  params: {
    jwt: string;
  };
}) {
  const result = await activateUser(params.jwt);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {result === "userNotExist" ? (
        <p className="text-4xl text-red-500">The user does not exist</p>
      ) : result === "alreadyActivated" ? (
        <p className="text-4xl text-red-500">The user is already activated</p>
      ) : (
        <p className="text-4xl font-bold text-white">
          Account activated successfully
        </p>
      )}
    </div>
  );
}
