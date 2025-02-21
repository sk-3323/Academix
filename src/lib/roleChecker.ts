import { ErrorHandler } from "./errorHandler";

export const isAuthorized = (data: any, role = "STUDENT"): boolean => {
  if (!role) {
    throw new ErrorHandler("Access denied", 403);
  }

  if (!data?.isAdmin && data?.role !== role) {
    throw new ErrorHandler(`Forbidden Access.`, 403);
  }

  return true;
};
