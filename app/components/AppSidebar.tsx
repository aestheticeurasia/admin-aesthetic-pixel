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
  HomeIcon,
  Image,
  Settings,
  SquarePen,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  const activeClass = "bg-red-600 text-white rounded-md p-2 w-full";
  const inactiveClass = "hover:bg-muted/50 rounded-md p-2 w-full";

  return (
    <Sidebar className="fixed left-0 top-25 w-64 h-[calc(100vh-90px)]">
      {/* Dashboard */}
      <SidebarHeader>
        <div className="mt-10">
          <Link href="/dashboard">
            <div
              className={`flex items-center px-8 gap-2 font-bold cursor-pointer ${
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
      <SidebarContent className="px-3 space-y-3">
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
              <Link href="/blog/new-post">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/blog/new-post")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <CirclePlus className="w-4 h-4" />
                  Create New Post
                </span>
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
                  <SquarePen className="w-4 h-4" />
                  Existing Posts
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-3 mt-4">
          <Link href="/category">
            <div
              className={`flex items-center gap-3 font-bold cursor-pointer my-1 ${
                pathname.startsWith("/category") ? activeClass : inactiveClass
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Category
            </div>
          </Link>
          <div className="ml-6 border-l border-muted-foreground/30 pl-4 my-1 space-y-3 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/category/new-category">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/category/new-category")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <CirclePlus className="w-4 h-4" />
                  Add Category
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/category/preview">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/category/preview")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <SquarePen className="w-4 h-4" />
                  Preview
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Category */}
        <div className="space-y-3 mt-4">
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
          <div className="ml-6 border-l border-muted-foreground/30 pl-4 my-1 space-y-3 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <Link href="/users/users-list">
                <span
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    pathname.startsWith("/users/users-list")
                      ? "text-red-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <Users className="w-4 h-4" />
                   Users List
                </span>
              </Link>
            </div>

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
          </div>
        </div>

        {/* Settings */}
        <Link href="/settings">
          <div
            className={`flex items-center gap-3 font-bold mt-5 cursor-pointer ${
              pathname === "/settings" ? activeClass : inactiveClass
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </div>
        </Link>

        {/* User Profile */}
        <Link href="/profile">
          <div
            className={`flex items-center gap-3 font-bold mt-4 cursor-pointer ${
              pathname === "/profile" ? activeClass : inactiveClass
            }`}
          >
            <UserRound className="w-4 h-4" />
            User Profile
          </div>
        </Link>
      </SidebarContent>

      <SidebarFooter className="flex mb-10 ms-5">
        <div className="flex items-center gap-3 font-bold mt-4 cursor-pointer hover:bg-red-600 rounded-md max-w-full py-2 px-4 text-red-600 hover:text-white transition-colors">
          <CirclePower className="w-4 h-4" /> Logout
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
