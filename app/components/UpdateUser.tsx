"use client";
import { FormEvent, useState, useEffect } from "react";
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
import { X, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const permissionsList = [
  { value: "view-dashboard", label: "View Dashboard" },
  { value: "manage-users", label: "Manage Users" },
  { value: "edit-content", label: "Edit Content" },
  { value: "access-report", label: "Access Report" },
  { value: "configure-settings", label: "Configure Settings" },
];

interface UserFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function UserForm({
  onClose,
  onSuccess,
  initialData,
}: UserFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [status, setStatus] = useState(initialData?.status || "Active");
  const [permissions, setPermissions] = useState<string[]>(
    initialData?.permissions || []
  );
  const [loading, setLoading] = useState(false);
  const demoAvatar = "/demoAvatar.png";

  // For update mode, use the avatar URL from data, otherwise use demo
  const currentAvatar = initialData?.avatar || demoAvatar;

  const handlePermissionChange = (value: string, checked: boolean) => {
    setPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  //handle update
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("status", status);
    formData.append("permissions", JSON.stringify(permissions));

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/update-user/${initialData._id}`,
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
      setStatus("");
      setPermissions([]);

      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setPhone(initialData.phone || "");
    setRole(initialData.role || "");
    setStatus(initialData.status || "Active");
    setPermissions(initialData.permissions || []);
  }, [initialData]);

  return (
    <div>
      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column*/}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-muted/40">
                <h1 className="font-semibold text-lg text-foreground">
                  {initialData
                    ? "Update User Information"
                    : "Basic Information"}
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

                {/* Role Select */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="role">Role</Label>
                  </div>
                  <Select
                    value={role}
                    onValueChange={setRole}
                    disabled={loading}
                  >
                    <SelectTrigger id="role" className="w-full cursor-pointer">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin" className="cursor-pointer">
                        <Badge className="bg-yellow-500 font-bold text-black">
                          Admin
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Moderator" className="cursor-pointer">
                        <Badge className="bg-blue-500 font-bold text-white">
                          Moderator
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Viewer" className="cursor-pointer">
                        <Badge className="bg-gray-500 font-bold text-white">
                          Viewer
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Select (New) */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={loading}
                  >
                    <SelectTrigger
                      id="status"
                      className="w-full cursor-pointer"
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active" className="cursor-pointer">
                        <Badge className="bg-green-700 font-bold text-white">
                          Active
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Blocked" className="cursor-pointer">
                        <Badge className="bg-red-500 font-bold text-white">
                          Blocked
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b bg-muted/40 text-center lg:text-left">
                <h1 className="font-semibold text-lg text-foreground">
                  Profile & Permissions
                </h1>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted shadow-sm mb-4 bg-muted">
                    <Image
                      src={currentAvatar}
                      alt="profile-img"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Profile Picture
                  </p>
                </div>

                <div className="border-t my-4" />

                {/* Permissions  */}
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
                    {initialData ? "Update" : "Save"}
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
