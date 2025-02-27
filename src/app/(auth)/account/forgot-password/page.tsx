"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MailIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { APIClient } from "@/helpers/apiHelper";
import { toast } from "sonner";

interface ResponseType {
  success: boolean;
  message: string;
  result: any;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const api = new APIClient();
      const result = await api.create("/auth/forgot-password", email, {
        "Content-Type": "application/json",
      });
      console.log(result);

      if (result.success) {
        toast.success(result.message);
        router.push("/account/check-email");
      } else {
        toast.error(result.message);
      }
      setError(null);
    } catch (err: any) {
      console.log(err, "error");

      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex overflow-hidden min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Alert className="border-green-100 bg-green-50 text-green-800">
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Check your email for a link to reset your password. If it
                doesn't appear within a few minutes, check your spam folder.
              </AlertDescription>
            </Alert>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <MailIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
                {!isLoading && <ArrowRightIcon className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <Button
            variant="link"
            className="px-2"
            onClick={() => router.push("/account/login")}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
