"use server";

import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import * as bcrypt from "bcrypt";
import {
  compileActivationTemplate,
  compileResetPassTemplate,
  sendMail,
} from "./mail";
import { signJwt, verifyJwt } from "@/lib/jwt";

export async function registerUser(
  user: Omit<User, "id" | "emailVerified" | "image" | "createdAt" | "updatedAt">
) {
  const result = await prisma.user.create({
    data: {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    },
  });
  const jwtUserId = signJwt(
    {
      id: result.id,
    },
    {
      expiresIn: "1d",
    }
  );
  const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
  const body = compileActivationTemplate(user.firstname, activationUrl);
  await sendMail({
    to: user.email,
    subject: "Activate your account",
    body: body,
  });
  return result;
}

type ActiveteUser = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivated" | "success">;

export const activateUser: ActiveteUser = async (jwtUserId) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return "userNotExist";
  }
  if (user.emailVerified) return "alreadyActivated";

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return "success";
};

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) throw new Error("The user Does not Exist!");

  const jwtUserId = signJwt({
    id: user.id,
  });

  const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${jwtUserId}`;
  const body = compileResetPassTemplate(user.firstname, resetPassUrl);
  const sendResult = await sendMail({
    to: user.email,
    subject: "Reset your password",
    body: body,
  });
  return sendResult;
}

type ResetPasswordFunc = (
  jwtUserid: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const resetPassword: ResetPasswordFunc = async (jwtUserid, password) => {
  const payload = verifyJwt(jwtUserid);
  if (!payload) return "userNotExist";
  const userId = payload.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return "userNotExist";

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });
  if (!result) throw new Error("An error occurred while updating the password");
  return "success";
};
