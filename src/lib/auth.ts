import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { EmailProvider } from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { ErrorHandler } from "./errorHandler";
import { verifyPassword } from "./fileHandler";

export const authOption: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/account/login",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 2,
    async encode({ secret, token }) {
      if (!token) {
        throw new ErrorHandler("Token not provided", 401);
      }
      return jwt.sign(token, secret, {
        algorithm: "HS256",
      });
    },
    async decode({ secret, token }) {
      try {
        if (!token) {
          throw new ErrorHandler("Token not provided", 401);
        }

        const decoded: any = await jwt.verify(token, secret); // Verify and decode the JWT

        return decoded;
      } catch (error: any) {
        console.error(error);
        throw new ErrorHandler(error.message, 401);
      }
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          placeholder: "Enter your username",
          type: "text",
        },
        password: {
          label: "Password",
          placeholder: "Enter your password",
          type: "password",
        },
      },
      authorize: async (credentials: any): Promise<any> => {
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                {
                  email: credentials?.username,
                },
                {
                  username: credentials?.username,
                },
              ],
            },
          });

          if (!user) {
            throw new ErrorHandler(
              "No user found with this email or username",
              401
            );
          }

          let isVerified = verifyPassword(
            credentials?.password,
            user?.password
          );

          if (isVerified) {
            return user;
          } else {
            throw new ErrorHandler("This password is incorrect", 401);
          }
        } catch (error: any) {
          console.error(error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY as string,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_SECRET_KEY as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.avatar = token.avatar;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
};
