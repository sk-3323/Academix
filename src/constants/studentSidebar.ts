import {
  Home,
  Settings,
  Users,
  HelpCircle,
  Menu,
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  CreditCard,
  LogOut,
  User,
  LogIn,
  Info,
  Contact,
  VideoIcon,
  TvMinimalPlay,
  MessageCircleQuestion,
} from "lucide-react";

export const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/student/course" },
  { icon: ShieldCheck, label: "Certificates", href: "/student/certificate" },
  { icon: User, label: "Profile", href: "/student/profile" },
  { icon: CreditCard, label: "Payment", href: "/student/payment" },
  { icon: VideoIcon, label: "Video Lectures", href: "/student/video" },
  { icon: MessageCircleQuestion, label: "Quiz", href: "/student/quiz" },
];
