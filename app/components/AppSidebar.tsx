"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  CirclePlus,
  CirclePower,
  FileImage,
  HomeIcon,
  Settings,
  SquarePen,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../context/auth";
import { destroyCookie } from "nookies";

export function AppSidebar() {
  const pathname = usePathname();
  const { setAuth } = useAuth();

  const activeClass = "bg-red-600 text-white rounded-md p-2 w-full";
  const inactiveClass = "hover:bg-muted/50 rounded-md p-2 w-full";

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    destroyCookie(null, "auth", { path: "/" });
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <Sidebar className="fixed top-30 h-[calc(100vh-90px)]">
      {/* Dashboard */}
      <SidebarHeader className="mb-2 mt-3">
        <div className="">
          <Link href="/dashboard">
            <div
              className={`flex items-center gap-2 font-bold cursor-pointer ${
                pathname.startsWith("/dashboard") ? activeClass : inactiveClass
              }`}
            >
              <HomeIcon className="w-4" />
              Dashboard
            </div>
          </Link>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-3 ">
        <div className="space-y-3">
          <Link href="/blog">
            <div
              className={`flex items-center gap-3 font-bold cursor-pointer my-1 ${
                pathname.startsWith("/blog") ? activeClass : inactiveClass
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </div>
          </Link>

          <div className="ml-6 border-l border-muted-foreground/30 pl-4 my-1 space-y-3 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/blog/create-new-post">
                <div
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/blog/create-new-post")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <CirclePlus className="w-4 h-4 dark:text-white" />
                  Create New Post
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/blog/existing-post">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/blog/existing-post")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <SquarePen className="w-4 h-4 dark:text-white" />
                  Existing Posts
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="">
          <Link href="/category">
            <div
              className={`flex items-center gap-3 font-bold cursor-pointer my-1 ${
                pathname.startsWith("/category") ? activeClass : inactiveClass
              }`}
            >
              <FileImage className="w-4 h-4" />
              Category
            </div>
          </Link>
          <div className="ml-6 border-l border-muted-foreground/30 pl-4 my-1 space-y-3 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/category/add-category">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/category/add-category")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <CirclePlus className="w-4 h-4 dark:text-white" />
                  Add Category
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/category/preview-category">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/category/preview-category")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <SquarePen className="w-4 h-4 dark:text-white" />
                  Preview
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="">
          <Link href="/users">
            <div
              className={`flex items-center gap-3 font-bold cursor-pointer my-1 ${
                pathname.startsWith("/users") ? activeClass : inactiveClass
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </div>
          </Link>
          {/* <div className="ml-6 border-l border-muted-foreground/30 pl-4 my-1 space-y-3 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/users/add-user">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/users/add-user")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Add User
                </span>
              </Link>
            </div>
          </div> */}
        </div>

        {/* Settings */}
        <Link href="/settings">
          <div
            className={`flex items-center gap-3 font-bold cursor-pointer ${
              pathname === "/settings" ? activeClass : inactiveClass
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </div>
        </Link>

        {/* Profile */}
        <Link href="/profile">
          <div
            className={`flex items-center gap-3 font-bold  cursor-pointer ${
              pathname === "/profile" ? activeClass : inactiveClass
            }`}
          >
            <UserRound className="w-4 h-4" />
            Profile
          </div>
        </Link>
      </SidebarContent>

      <SidebarFooter className="flex mb-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-bold cursor-pointer hover:bg-red-700 rounded-md hover:text-white py-2 my-2 justify-center"
        >
          <CirclePower className="w-4 h-4" /> Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
