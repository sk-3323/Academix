import { authOption } from "../../../../lib/auth";

import NextAuth from "next-auth";
const handler = NextAuth(authOption);
console.log(handler);

export { handler as GET, handler as POST };
