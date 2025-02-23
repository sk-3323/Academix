import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    username: string;
    avatar: string;
    phone: string;
    isAdmin: boolean;
    role: string;
    location: string;
  }

  interface Session {
    user: User;
  }
}
