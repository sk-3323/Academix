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
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github } from "lucide-react";
import { useEffect, useState } from "react";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const username = values.username;
    const password = values.password;
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // Prevents auto-redirect
    });

    if (result?.error) {
      toast.error(result?.error);
    } else if (result?.ok) {
      toast.success("Login successful");
    }
  }

  useEffect(() => {
    if (!session) return;
    if (session?.user?.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (session?.user?.role === "TEACHER") {
      router.push("/teacher/dashboard");
    } else if (session?.user?.role === "STUDENT") {
      router.push("/classroom");
    } else {
      router.push("/");
    }
  }, [session]);

  return (
    <div className="h-[95vh] grid place-items-center">
      <Card className="w-[80vw] md:w-[55vw] lg:w-[30vw]">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Academix</CardTitle>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username or email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <div className="relative w-4 h-4">
                            <Eye
                              className={`absolute transition-opacity duration-300 ${
                                showPassword ? "opacity-0" : "opacity-100"
                              }`}
                            />
                            <EyeOff
                              className={`absolute transition-opacity duration-300 ${
                                showPassword ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </div>
                        </Button>
                      </div>
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
        <CardFooter className="flex justify-between flex-col gap-3 w-full">
          <div className="btngoogle w-full">
            <Button
              variant="outline"
              onClick={async () => {
                const result: any = await signIn("google", {
                  callbackUrl: "/",
                  redirect: false,
                });
                if (result.ok) {
                  const res = await fetch("/api/google-data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  });
                  const data = await res.json();
                }
              }}
              className="w-full rounded-full"
            >
              <img
                src="data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M17.4612 7.21757H16.751V7.18098H8.81632V10.7075H13.7989C13.072 12.7604 11.1187 14.234 8.81632 14.234C5.89503 14.234 3.52653 11.8655 3.52653 8.94425C3.52653 6.02296 5.89503 3.65446 8.81632 3.65446C10.1648 3.65446 11.3916 4.16316 12.3257 4.9941L14.8194 2.5004C13.2448 1.03292 11.1385 0.12793 8.81632 0.12793C3.94751 0.12793 0 4.07544 0 8.94425C0 13.8131 3.94751 17.7606 8.81632 17.7606C13.6851 17.7606 17.6326 13.8131 17.6326 8.94425C17.6326 8.35311 17.5718 7.77609 17.4612 7.21757Z' fill='%23FFC107' /%3E%3Cpath d='M1.0166 4.84069L3.9132 6.96498C4.69697 5.02451 6.59513 3.65446 8.8164 3.65446C10.1649 3.65446 11.3916 4.16316 12.3257 4.9941L14.8194 2.5004C13.2448 1.03292 11.1386 0.12793 8.8164 0.12793C5.43005 0.12793 2.49333 2.03975 1.0166 4.84069Z' fill='%23FF3D00' /%3E%3Cpath d='M8.8165 17.7612C11.0938 17.7612 13.1629 16.8897 14.7274 15.4725L11.9988 13.1635C11.0839 13.8593 9.96591 14.2356 8.8165 14.2347C6.52338 14.2347 4.57629 12.7725 3.84278 10.7319L0.967773 12.947C2.42687 15.8022 5.39004 17.7612 8.8165 17.7612Z' fill='%234CAF50' /%3E%3Cpath d='M17.4612 7.21823H16.7511V7.18164H8.81641V10.7082H13.7989C13.4512 11.6852 12.8249 12.539 11.9973 13.164L11.9987 13.1631L14.7273 15.4721C14.5342 15.6475 17.6327 13.3531 17.6327 8.9449C17.6327 8.35377 17.5719 7.77674 17.4612 7.21823Z' fill='%231976D2' /%3E%3C/svg%3E%0A"
                alt="google"
              />
              Continue with Google
            </Button>
          </div>
          {/* <div className="w-1/2">
              <Button
                variant="outline"
                onClick={async () => {
                  const res = await signIn("github", {
                    callbackUrl: "/",
                    redirect: false,
                  });
                  console.log(res, "res");
                }}
              >
                Login with Github
              </Button>
            </div> */}
          <div className="">
            <a
              href="/account/forgot-password"
              className="tracking-tighter text-[#9e9e9e]"
            >
              Forgot Password?
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
