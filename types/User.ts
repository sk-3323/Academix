export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  avatar?: string;
  role?: string;
  verified?: boolean;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isAdmin?: boolean;
}
