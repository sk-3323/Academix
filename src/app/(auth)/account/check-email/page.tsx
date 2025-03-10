"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailIcon, RefreshCwIcon, ArrowLeftIcon } from "lucide-react";
import { Suspense, useState } from "react";
import Loading from "@/components/Sidebar/Loading";

const CheckEmailPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CheckEmail />
    </Suspense>
  );
};

const CheckEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  //   const [isResending, setIsResending] = useState(false);
  //   const [resendSuccess, setResendSuccess] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MailIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a password reset link to
            {email && (
              <div className="mt-1 font-medium text-foreground">{email}</div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            <p>Click the link in the email to reset your password.</p>
            <p className="mt-2">
              If you don't see the email, check your spam folder.
            </p>
          </div>

          <div className="rounded-md bg-green-50 p-3 text-sm text-[#27e0b3]">
            Reset link has been resent to your email.
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <Link
            href="/account/login"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckEmailPage;
