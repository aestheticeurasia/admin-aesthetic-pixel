"use client";
import { FormEvent, useState } from "react";
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
import { Trash2, X, Loader2 } from "lucide-react"; // Imported Loader2
import axios from "axios";
import { toast } from "sonner";

const permissionsList = [
  { value: "view-dashboard", label: "View Dashboard" },
  { value: "manage-users", label: "Manage Users" },
  { value: "edit-content", label: "Edit Content" },
  { value: "access-report", label: "Access Report" },
  { value: "configure-settings", label: "Configure Settings" },
];

export default function AddNewUser({
  onClose,
  onUserCreated,
}: {
  onClose?: () => void;
  onUserCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const demoAvatar = "/demoAvatar.png";

  const handlePermissionChange = (value: string, checked: boolean) => {
    setPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const createNewUser = new FormData();
    createNewUser.append("name", name);
    createNewUser.append("email", email);
    createNewUser.append("phone", phone);
    createNewUser.append("role", role);
    createNewUser.append("password", password);
    createNewUser.append("permissions", JSON.stringify(permissions));

    if (avatar) {
      createNewUser.append("avatar", avatar);
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/create-user`,
        createNewUser
      );

      toast.success(res.data && res.data.message);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setRole("");
      setPassword("");
      setAvatar(null);
      setPermissions([]);
      onUserCreated();
      onClose();
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
    <div className="container">
      <form onSubmit={handleCreate}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="bg-[#f4f5f7] dark:bg-gray-800 py-4 px-8 rounded-lg w-full md:w-2/3">
            <h1 className="font-bold text-lg mb-5">Basic Information</h1>
            <div className="space-y-4 md:space-y-7">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="my-4 bg-white dark:bg-gray-700"
                  placeholder="Full Name"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="my-4 bg-white dark:bg-gray-700"
                  placeholder="Email Address"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="my-4 bg-white dark:bg-gray-700"
                  placeholder="Phone Number"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} disabled={loading}>
                  <div className="flex gap-2">
                    <SelectTrigger
                      id="role"
                      className="my-4 w-full bg-white dark:bg-gray-700"
                    >
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                    {role && (
                      <button
                        type="button"
                        onClick={() => setRole("")}
                        className="text-sm px-2 cursor-pointer rounded-full"
                        disabled={loading}
                      >
                        <X />
                      </button>
                    )}
                  </div>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="my-4 bg-white dark:bg-gray-700"
                  placeholder="Password"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/3 h-full">
            <div className="bg-[#f4f5f7] dark:bg-gray-800 py-4 px-8 rounded-lg">
              <h1 className="font-bold text-lg mb-8 text-center">
                Profile & Permissions
              </h1>
              <div className="text-center my-4">
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
                  <Button
                    variant="outline"
                    asChild
                    disabled={loading}
                    type="button"
                  >
                    <span className="max-w-[140px] truncate">
                      {avatar ? avatar.name : "Upload Photo"}
                    </span>
                  </Button>

                  {avatar && (
                    <Button
                      variant="destructive"
                      className="cursor-pointer"
                      type="button"
                      disabled={loading}
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
                  disabled={loading}
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
                      disabled={loading}
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

            {/* Bottom Buttons (Duplicated for mobile convenience) */}
            <div className="mt-7 ml-5 space-x-2 flex">
              <Button
                variant="destructive"
                className="font-bold cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
              <Button
                onClick={onClose}
                variant="secondary"
                className="font-bold cursor-pointer"
                type="button"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
