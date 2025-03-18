"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { LockIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { APIClient } from "@/helpers/apiHelper";

export default function ResetPassword() {
  const id = useParams();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const api = new APIClient();
      const data = {
        password,
        id: id.id,
      };
      const result = await api.update("/auth/forgot-password", data, {
        "Content-Type": "application/json",
      });
      if (!result.status) {
        throw new Error(result.message);
      }
      setIsSuccess(true);
      toast.success("Password reset successful. You can now log in.");
      router.push("/account/login");
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Reset your password
          </CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Alert className="border-green-100 bg-green-50 text-green-800">
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Your password has been successfully reset. You can now log in
                with your new password.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <LockIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <LockIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset password"}
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
