import jwt from "jsonwebtoken";

export const encryptToken = async (user: any) => {
  const payload = {
    id: user?.id,
    username: `${user?.first_name} ${user?.last_name}`,
    email: user?.email,
    role: user?.rolemaster?.role,
  };

  const token = await jwt.sign(payload, process.env.NEXTAUTH_SECRET as string, {
    expiresIn: "2d",
    algorithm: "HS256",
  });
  return token;
};

export const decryptToken = async (token: any) => {
  const payload = await jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
  return payload;
};
