import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Your Email Address",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.username,
          },
        });
        if (!user) {
          throw new Error("User name or password is incorrect");
        }

        // This is a naive implementation of password check
        const isPasswordCorrect = credentials?.password === user.password;

        // This is a professional implementation of password check
        if (!credentials?.password) {
          throw new Error("Password is a required field");
        }
        const isPasswordCorrectPro = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrectPro) {
          throw new Error("Password is incorrect");
        }

        if (!user.emailVerified) {
          throw new Error("Email is not verified");
        }

        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as User;
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};
