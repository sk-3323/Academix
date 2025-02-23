export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  avatar?: string;
  role?: string;
  verified?: boolean;
  verifyCode?: string;
  isBlocked?: boolean;
  verifyCodeExpiry?: Date;
  isAdmin?: boolean;
  location?: string;
}
