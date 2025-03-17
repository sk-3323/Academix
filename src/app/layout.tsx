import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Providers } from "@/components/Providers/Providers";
import StoreProvider from "@/context/StoreProvider";
import type React from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Academix | Welcome",
  description: "Welcome to academix.",
  verification: {
    google: "4x5OVPfZzNrwaWklvtifrqKABapEe4SvZc22OiNEJWk",
  },
  icons: {
    icon: [{ url: "/assets/logos/fevicon.svg", type: "image/svg+xml" }],
    shortcut: "/assets/logos/fevicon.svg",
    apple: [{ url: "/assets/logos/fevicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <AuthProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Providers>{children}</Providers>
          </body>
        </AuthProvider>
      </StoreProvider>
    </html>
  );
}
