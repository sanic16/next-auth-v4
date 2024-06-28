"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function SigninButton() {
  const { data: session } = useSession();
  return (
    <div className="flex items-center gap-2">
      {session && session.user ? (
        <>
          <Link href="/profile">{`${session.user.firstname}`}</Link>
          <Link
            href="/api/auth/signout"
            className="text-sky-500 hover:text-sky-600 transition-colors"
          >
            Sign Out
          </Link>
        </>
      ) : (
        <>
          <Button onClick={() => signIn()}>Sign In</Button>
          <Button as={Link} href="/auth/signup">
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
}
