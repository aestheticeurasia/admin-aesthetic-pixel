"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  User,
  Award,
  Trash2,
  UploadCloud,
  CalendarDays,
  Clock,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useAuth } from "../context/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Profile() {
  const { auth } = useAuth();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const demoAvatar = "/demoAvatar.png";
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
              {/* Avatar Section */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted shadow-sm mb-4 bg-muted">
                  <Image
                    src={
                      avatar
                        ? typeof avatar === "string"
                          ? avatar
                          : URL.createObjectURL(avatar)
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
                        {avatar ? avatar.name : "Upload Photo"}
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
                      disabled={loading}
                    />
                  </Label>

                  {avatar && (
                    <Button
                      variant="destructive"
                      size="icon"
                      type="button"
                      className="h-9 w-9 cursor-pointer"
                      disabled={loading}
                      onClick={() => setAvatar(null)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* User Details Grid */}
              <div className="space-y-5">
                {/* Full Name */}
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

                {/* Email */}
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

                {/* Phone */}
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

                {/* Role */}
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
              </div>
            </CardContent>

            {/* NEW FOOTER SECTION */}
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

          {/* Right Column: Security & Notifications (8 cols) */}
          <div className="md:col-span-12 lg:col-span-8 space-y-6">
            {/* Password Settings (Remains Editable) */}
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
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    type="password"
                    id="current-password"
                    placeholder="••••••••"
                    className="bg-background"
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      type="password"
                      id="new-password"
                      placeholder="••••••••"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      type="password"
                      id="confirm-password"
                      placeholder="••••••••"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex items-center justify-between space-x-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">
                      Email Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates for comments and mentions.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">
                      SMS Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive SMS alerts for critical security events.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-4">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">
                      Marketing Communications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
