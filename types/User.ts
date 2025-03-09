enum Role {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  avatar?: string;
  role?: Role;
  verified?: boolean;
  verifyCode?: string;
  isBlocked?: boolean;
  verifyCodeExpiry?: Date;
  isAdmin?: boolean;
  location?: string;
}
