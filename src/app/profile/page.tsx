import { authOptions } from "@/lib/authOptions";
import { Image } from "@nextui-org/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return redirect("/auth/signin");
  return (
    <div>
      <Image
        height={300}
        width={300}
        src={user?.image ?? ""}
        alt={user?.firstname ?? ""}
        className="rounded-full"
      />
      <div className="grid grid-cols-4 gap-y-4">
        <p>First name:</p>
        <p className="col-span-3">{user?.firstname}</p>
        <p>Last name:</p>
        <p className="col-span-3">{user?.lastname}</p>
        <p>Email:</p>
        <p className="col-span-3">{user?.email}</p>
        <p>Phone:</p>
        <p className="col-span-3">{user?.phone}</p>
      </div>
    </div>
  );
}
