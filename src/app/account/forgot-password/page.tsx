"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github } from "lucide-react";
import { useState } from "react";
import { APIClient } from "@/helpers/apiHelper";

const formSchema = z.object({
  email: z.string(),
});

const page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const handleResendOtp = async (email: string) => {
    let api = new APIClient();
    const res: any = await api.update("/auth/verify-otp", {
      id: email,
    });
    if (res.status) {
      toast.success("Verification code has been resent.");
    } else {
      toast.error(res.message);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const email = values.email;
    if (email !== "") {
      console.log(email);

      handleResendOtp(email);
    } else {
      toast.error("Email id required");
    }
  }
  return (
    <div className="h-[95vh] grid place-items-center">
      <Card className="w-[80vw] md:w-[55vw] lg:w-[30vw]">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <span className="tracking-tighter text-[#9e9e9e]">
            Create an account?
            <a
              href="/account/signup"
              className="tracking-tighter text-[#0085FF] ms-1"
            >
              Sign Up
            </a>
          </span>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
