import { useSession } from "next-auth/react";

export const useRole = () => {
  const { data, status } = useSession();
  const role = data?.user.role;
  return {
    role,
    status,
  };
};
