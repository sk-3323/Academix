import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  MessageCircleQuestion,
  ShieldCheck,
  TvMinimalPlay,
  User,
} from "lucide-react";

export const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/teacher/course" },
  { icon: ShieldCheck, label: "Certificates", href: "/teacher/certificate" },
  { icon: User, label: "Students", href: "/teacher/student" },
  { icon: CreditCard, label: "Wallet", href: "/teacher/wallet" },
  { icon: TvMinimalPlay, label: "Live Class", href: "/teacher/live-class" },
  { icon: MessageCircleQuestion, label: "Quiz", href: "/teacher/quiz" },
];
