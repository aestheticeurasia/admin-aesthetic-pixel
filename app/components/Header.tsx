"use client";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "../context/auth";

export default function Header() {
  const {auth, setAuth} = useAuth();
  return (
    <header className="w-full py-2 fixed z-50 dark-[#18181b] border-b border-muted-foreground/10 top-0">
      <div className="container mx-auto flex items-center justify-between px-4 h-auto">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Aesthetic Pixel Logo"
            width={100}
            height={40}
            className="block dark:hidden"
          />
          <Image
            src="/logoDark.png"
            alt="Aesthetic Pixel Logo Dark"
            width={100}
            height={40}
            className="hidden dark:block"
          />
        </Link>

        <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 relative">
          <span className="space-y-2 my-5">
            <h1 className="font-bold text-2xl">Welcome Back</h1>
            <p className="text-md">
              Here&apos;s what&apos;s happening with your photography portfolio
              today.
            </p>
          </span>
        </nav>

        <div className="flex items-center gap-3 me-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm">{auth?.user?.name}</span>
            <span className="text-xs text-muted-foreground">{auth?.user?.role}</span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
