"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import OtpInput from "@/components/otpInput/otpInput";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const page = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");

  const { handleSubmit } = useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const emailParam = searchParams.get("uid");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  console.log(email);
  const onSubmit = async (otp: string) => {
    setIsVerifying(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    // Simulate API call for OTP verification
    const data = await res.json();
    console.log(res, "Resps");

    if (data?.user?.isVerified) {
      toast.success(data.message);
      router.push("/");
    } else {
      toast.error(data.message);
    }
    setIsVerifying(false);
    // Here you would typically make an API call to verify the OTP
  };
  return (
    <div className="h-[95vh] flex items-center w-full justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a code to your email. Please enter it below to verify
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(() => {})}>
            <div className="mb-6 flex justify-center">
              <OtpInput length={6} onComplete={onSubmit} />
            </div>
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <Button variant="link" className="p-0 h-auto">
              Resend OTP
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
