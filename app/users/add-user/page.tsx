"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, X } from "lucide-react";

const permissionsList = [
  { value: "view-dashboard", label: "View Dashboard" },
  { value: "manage-users", label: "Manage Users" },
  { value: "edit-content", label: "Edit Content" },
  { value: "access-report", label: "Access Report" },
  { value: "configure-settings", label: "Configure Settings" },
];

export default function AddUser() {
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const demoAvatar = "/demoAvatar.png";

  const handlePermissionChange = (value: string, checked: boolean) => {
    setPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-10 md:mb-4">
        <span className="text-xl font-bold">Add New User</span>
        <div className="space-x-2">
          <Button variant="destructive" className="font-bold cursor-pointer">
            Save
          </Button>
          <Button variant="secondary" className="font-bold cursor-pointer">
            Cancel
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-[#f4f5f7] dark:bg-gray-800 py-4 px-8 rounded-lg w-full md:w-2/3">
          <h1 className="font-bold text-lg mb-5">Basic Information</h1>

          <div className="space-y-4 md:space-y-7">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input type="text" className="my-2" placeholder="Full Name" />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                className="my-2"
                placeholder="Email Address"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input type="tel" className="my-2" placeholder="Phone Number" />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <div className="flex gap-2">
                  <SelectTrigger id="role" className="my-2 w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                  {role && (
                    <button
                      onClick={() => setRole("")}
                      className="text-sm px-2 cursor-pointer rounded-full"
                    >
                      <X />
                    </button>
                  )}
                </div>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" className="my-2" placeholder="Password" />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 h-full">
          <div className="bg-[#f4f5f7] dark:bg-gray-800 py-4 px-8 rounded-lg">
            <h1 className="font-bold text-lg mb-5">Profile & Permissions</h1>
            <div className="text-center mt-4">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                <Image
                  src={
                    avatar
                      ? typeof avatar === "string"
                        ? avatar
                        : URL.createObjectURL(avatar)
                      : demoAvatar
                  }
                  alt="profile-img"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <label className="cursor-pointer mx-auto flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                {/* Upload Button */}
                <Button variant="outline" asChild>
                  <span className="max-w-[140px] truncate">
                    {avatar ? avatar.name : "Upload Photo"}
                  </span>
                </Button>

                {avatar && (
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setAvatar(null);
                    }}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>

              <Input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0])
                    setAvatar(e.target.files[0]);
                  e.target.value = "";
                }}
                hidden
              />
            </label>

            <hr className="my-5" />
            <h3 className="font-bold text-md my-5">Permissions</h3>
            <div className="flex flex-col gap-2 ml-5 my-3">
              {permissionsList.map((perm) => (
                <div key={perm.value} className="flex items-center py-1">
                  <Checkbox
                    id={perm.value}
                    checked={permissions.includes(perm.value)}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(perm.value, checked === true)
                    }
                  />
                  <Label htmlFor={perm.value} className="ml-2">
                    {perm.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 ml-5 space-x-2">
            <Button variant="destructive" className="font-bold cursor-pointer">
              Save
            </Button>
            <Button variant="secondary" className="font-bold cursor-pointer">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
