"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "../context/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const router = useRouter();

  //handle Login
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loginData = new FormData();
    loginData.append("email", email);
    loginData.append("phone", phone);
    loginData.append("password", password);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/login`,
        loginData
      );

      if (res && res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get("from") || "/";
        router.push(redirectTo);
      }

      toast.success(res.data && res.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "Something went wrong");
      } else {
        console.error(error);
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="container max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Logo */}
            {/* <div className="relative w-full flex justify-center md:justify-start">
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full dark:bg-red-900/20" />
              <Image
                src="/logo.png"
                alt="Aesthetic Pixel Logo"
                width={350}
                height={90}
                className="relative block dark:hidden w-40 md:w-[150px] h-auto object-contain"
                priority
              />

              <Image
                src="/logoDark.png"
                alt="Aesthetic Pixel Logo Dark"
                width={250}
                height={90}
                className="relative hidden dark:block w-40 md:w-[150px] h-auto object-contain"
                priority
              />
            </div> */}

            <div className="space-y-5">
              <h1 className="font-extrabold text-4xl sm:text-5xl tracking-tight text-gray-900 dark:text-gray-50 leading-snug">
                Welcome to <br />
                Aesthetic{" "}
                <span className="text-red-600 dark:text-red-500">
                  Pixel
                </span>{" "}
                Studio LLC
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto lg:mx-0">
                Crafting digital experiences with precision and passion. Please
                sign in to access your dashboard.
              </p>
            </div>
          </div>

          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <form onSubmit={handleSubmit}>
              <Card className="w-full max-w-md mx-auto border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Sign in
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form className="space-y-5">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Email
                      </Label>
                      <Input
                        value={email || phone}
                        onChange={(e) => (
                          setEmail(e.target.value), setPhone(e.target.value)
                        )}
                        placeholder="name@aestheticpixel.com"
                        className="h-11 bg-gray-50 dark:bg-gray-950/50 focus-visible:ring-red-500/30 border-gray-200 dark:border-gray-800"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          Password
                        </Label>
                        <Link
                          href="#"
                          className="text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-500 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        type="password"
                        className="h-11 bg-gray-50 dark:bg-gray-950/50 focus-visible:ring-red-500/30 border-gray-200 dark:border-gray-800"
                        required
                      />
                    </div>
                  </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2 mb-3">
                  <Button
                    variant="default"
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Spinner /> Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
