import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { ErrorHandler } from "./errorHandler";
import { validateData, verifyPassword } from "./fileHandler";
import loginSchema from "@/schema/login/schema";

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
        username: {},
        password: {},
      },
      authorize: async (credentials: any): Promise<any> => {
        try {
          const data = await validateData(loginSchema, {
            username: credentials?.username,
            password: credentials?.password,
          });

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                {
                  email: data?.username,
                },
                {
                  username: data?.username,
                },
              ],
            },
            select: {
              id: true,
              email: true,
              username: true,
              avatar: true,
              phone: true,
              password: true,
              role: true,
              isBlocked: true,
            },
          });

          if (!user) {
            throw new ErrorHandler("User does not exist. Please sign up.", 401);
          }

          if (user?.isBlocked) {
            throw new ErrorHandler("You are not allowed to access this", 401);
          }

          const isVerified = verifyPassword(data?.password, user?.password);

          if (isVerified) {
            const payload: any = { ...user };
            if (payload?.role === "ADMIN") {
              payload.isAdmin = true;
            }

            return payload;
          } else {
            throw new ErrorHandler("Password is incorrect", 401);
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
        token.isAdmin = user.isAdmin;
        token.role = user.role;
        token.isBlocked = user.isBlocked;
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
        session.user.isAdmin = token.isAdmin;
        session.user.role = token.role;
        session.user.isBlocked = token.isBlocked;
      }
      return session;
    },
  },
};
