"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftRight, Clipboard, Menu } from "lucide-react";
import { ModeToggle } from "./dark-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MainNav() {
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathName === "/";

  const isActive = (path: string) => {
    if (path === "/") {
      return pathName === "/";
    }
    return pathName.startsWith(path);
  };

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isHome
          ? scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
          : "bg-white dark:bg-black shadow-sm"
      }`}
    >
      {" "}
      <div className="container mx-auto flex h-25 items-center justify-between px-4">
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

        {/* Desktop Nav */}
        <nav className="md:flex flex-1 justify-center items-center space-x-6 relative">
          <span className="space-y-2 my-5">
            <h1 className="font-bold text-2xl">Welcome Back</h1>
            <p className="text-md">
              Here&apos;s what&apos;s happening with your photography portfolio
              today.
            </p>
          </span>
        </nav>

        {/* Desktop Book a Slot Button */}
        <span className="hidden md:inline-flex text-foreground me-3">
          <Link href="/studio-rent" target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              className="cursor-pointer text-black dark:text-white font-bold text-lg"
            >
              Rent Studio
            </Button>
          </Link>
        </span>

        {/* Desktop Theme Toggle */}

        {/* <span className="hidden md:inline-flex text-foreground">
            <ModeToggle className="text-foreground" />
          </span> */}

        {/* Mobile Menu */}
        <div className=" flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded hover:bg-muted text-foreground">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                {/* Quote */}
                <SheetClose asChild>
                  <Link
                    href="/studio-rent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-5 px-8 block"
                  >
                    <Button variant="secondary" className="w-full font-bold">
                      <ArrowLeftRight className="w-5 h-5" />
                      Rent Studio
                    </Button>
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          {/* Dark Mode Toggle beside menu icon */}
          {/* <ModeToggle className="text-foreground" /> */}
        </div>
      </div>
    </header>
  );
}
