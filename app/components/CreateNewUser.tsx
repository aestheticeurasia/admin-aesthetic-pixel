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
import { Trash2, X, Loader2, UploadCloud } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const permissionsList = [
  { value: "view-dashboard", label: "View Dashboard" },
  { value: "manage-users", label: "Manage Users" },
  { value: "edit-content", label: "Edit Content" },
  { value: "access-report", label: "Access Report" },
  { value: "configure-settings", label: "Configure Settings" },
];

interface AddNewUserProps {
  onClose?: () => void;
  onUserCreated?: () => void;
}

export default function AddNewUser({
  onClose,
  onUserCreated,
}: AddNewUserProps) {
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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("password", password);
    formData.append("permissions", JSON.stringify(permissions));

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/create-user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data?.message);

      // Reset
      setName("");
      setEmail("");
      setPhone("");
      setRole("");
      setPassword("");
      setAvatar(null);
      setPermissions([]);

      onUserCreated?.();
      onClose?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreate}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-muted/40">
                <h1 className="font-semibold text-lg text-foreground">
                  Basic Information
                </h1>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Full Name"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="role">Role</Label>
                    {role && (
                      <button
                        type="button"
                        onClick={() => setRole("")}
                        className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors cursor-pointer"
                        disabled={loading}
                      >
                        Clear
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <Select
                    value={role}
                    onValueChange={setRole}
                    disabled={loading}
                  >
                    <SelectTrigger id="role" className="w-full cursor-pointer">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin" className="cursor-pointer">
                        Admin
                      </SelectItem>
                      <SelectItem value="Moderator" className="cursor-pointer">
                        Moderator
                      </SelectItem>
                      <SelectItem value="Viewer" className="cursor-pointer">
                        Viewer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Permissions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b bg-muted/40 text-center lg:text-left">
                <h1 className="font-semibold text-lg text-foreground">
                  Profile & Permissions
                </h1>
              </div>

              <div className="p-6 flex-1 flex flex-col">
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

                <div className="border-t my-4" />

                {/* Permissions Section */}
                <div>
                  <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                    Permissions
                  </h3>
                  <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                    {permissionsList.map((perm) => (
                      <div
                        key={perm.value}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          className="border-red-700 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=checked]:hover:bg-red-700 data-[state=checked]:focus:ring-red-500"
                          id={perm.value}
                          checked={permissions.includes(perm.value)}
                          disabled={loading}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(perm.value, checked === true)
                          }
                        />
                        <Label
                          htmlFor={perm.value}
                          className="text-sm font-normal cursor-pointer select-none"
                        >
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-8 flex gap-3">
                  <Button
                    variant="destructive"
                    className="flex-1 font-bold cursor-pointer"
                    type="submit"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 font-bold cursor-pointer"
                    type="button"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
