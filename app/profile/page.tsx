"use client";

import React, { FormEvent, useState } from "react";
import {
  Mail,
  Phone,
  User,
  Award,
  Trash2,
  UploadCloud,
  CalendarDays,
  Clock,
  Check,
  LockKeyholeIcon,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useAuth } from "../context/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { setCookie } from "nookies";

dayjs.extend(relativeTime);

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const demoAvatar = "/demoAvatar.png";

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/update-password`,
        formData
      );

      toast.success(data?.message);

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // handle avatar upload
  const handleAvatarUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!avatar) return;
    setAvatarLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const token = auth?.token;

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/update-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = {
        ...auth?.user,
        avatar: data?.user?.avatar || data?.avatar,
      };

      const updatedAuth = {
        ...auth,
        user: updatedUser,
      };

      setAuth(updatedAuth);

      setCookie(null, "auth", JSON.stringify(updatedAuth), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      toast.success(data?.message);
      setAvatar(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container md:px-20 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-12 lg:col-span-4 h-fit border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Profile Information
              </CardTitle>
              <CardDescription>
                Personal details are managed by your administrator.
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-6">
              {/* Avatar Form */}
              <form
                onSubmit={handleAvatarUpdate}
                className="flex flex-col items-center justify-center mb-8"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted shadow-sm mb-4 bg-muted">
                  <Image
                    src={
                      avatar
                        ? URL.createObjectURL(avatar)
                        : auth?.user?.avatar
                        ? auth?.user?.avatar
                        : demoAvatar
                    }
                    alt="profile-img"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      <UploadCloud className="w-4 h-4 mr-2" />
                      <span className="max-w-[120px] truncate">
                        {avatar ? "Change" : "Upload Photo"}
                      </span>
                    </div>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0])
                          setAvatar(e.target.files[0]);
                        e.target.value = "";
                      }}
                      className="hidden"
                      disabled={avatarLoading}
                    />
                  </Label>

                  {avatar && (
                    <>
                      <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 cursor-pointer"
                        disabled={avatarLoading}
                      >
                        {avatarLoading ? (
                          <Spinner className="w-4 h-4 text-white" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        className="h-9 w-9 cursor-pointer"
                        disabled={avatarLoading}
                        onClick={() => setAvatar(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </form>

              <Separator className="my-6" />

              {/* User Details Grid */}
              <div className="space-y-5">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Full Name
                    </p>
                    <p className="text-base font-medium text-foreground">
                    {auth?.user?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Email Address
                    </p>
                    <p className="text-base font-medium text-foreground">
                      {auth?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Phone
                    </p>
                    <p className="text-base font-medium text-foreground">
                      {auth?.user?.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Role
                    </p>
                    <div className="text-base font-medium text-foreground">
                      <Badge
                        className={`capitalize my-1 ${
                          auth?.user?.role === "Admin"
                            ? "bg-yellow-500 font-extrabold text-black hover:bg-yellow-400"
                            : auth?.user?.role === "Moderator"
                            ? "bg-sky-500 font-bold text-white hover:bg-sky-400"
                            : "bg-gray-500 text-white hover:bg-gray-400"
                        }`}
                      >
                        {auth?.user?.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <LockKeyholeIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Status
                    </p>
                    <div className="text-base font-medium text-foreground">
                      <Badge
                        className={`capitalize my-1 ${
                          auth?.user?.status === "Active"
                            ? "bg-green-700 font-extrabold text-white hover:bg-green-400"
                            : auth?.user?.status === "Blocked"
                            ? "bg-red-500 font-bold text-white hover:bg-red-400"
                            : "bg-gray-500 text-white hover:bg-gray-400"
                        }`}
                      >
                        {auth?.user?.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t">
              <div className="flex w-full justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5" title="Date Joined">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>
                    Joined {dayjs(auth?.user?.createdAt).format("DD MMM YYYY")}
                  </span>
                </div>

                <div
                  className="flex items-center gap-1.5"
                  title="Last Profile Update"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated {dayjs(auth?.user?.updatedAt).fromNow()}</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <div className="md:col-span-12 lg:col-span-8 space-y-6">
            <div className="md:col-span-12 lg:col-span-8 space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Security
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form className="space-y-6" onSubmit={handlePasswordChange}>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        type="password"
                        id="current-password"
                        placeholder="Current Password"
                        className="bg-background"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          type="password"
                          id="new-password"
                          placeholder="New Password"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          type="password"
                          id="confirm-password"
                          placeholder="Confirm Password"
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="cursor-pointer">
                        {loading ? (
                          <>
                            <Spinner /> Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}{" "}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
