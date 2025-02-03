export interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  avatar?: string;
  role?: number;
  verified?: boolean;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isAdmin?: boolean;
}
