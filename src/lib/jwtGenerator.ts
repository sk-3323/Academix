const jwt = require("jsonwebtoken");

export const encryptToken = async (user: any) => {
  const payload = {
    id: user?.id,
    username: `${user?.first_name} ${user?.last_name}`,
    email: user?.email,
    role: user?.rolemaster?.role,
  };

  let token = await jwt.sign(payload, process.env.NEXTAUTH_SECRET, {
    expiresIn: "2d",
    algorithm: "HS256",
  });
  return token;
};

export const decryptToken = async (token: any) => {
  let payload = await jwt.verify(token, process.env.NEXTAUTH_SECRET);
  return payload;
};
