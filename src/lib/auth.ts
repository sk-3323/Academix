import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { EmailProvider } from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import { AuthOptions } from "next-auth";
import { prisma } from "./prisma";

export const authOption: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/error",
    signOut: "/login",
  },
  providers: [
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     username: {},
    //     password: {},
    //   },
    //   async authorize(credentials, req) {
    //     const username = credentials?.username;
    //     const password = credentials?.password;

    //     if (!username && !password) {
    //       return null;
    //     }

    //     const user = await prisma.user.findUnique({
    //       where: {
    //         username,
    //         password,
    //       },
    //     });

    //     if (!user) {
    //       return null;
    //     }

    //     return user;
    //   },
    // }),
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
  secret: "dhdhadahjsj",

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.name = token.name;
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
