"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lock, Unlock, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

dayjs.extend(relativeTime);

interface User {
  _id: string;
  email: string;
  phone: string;
  name: string;
  avatar: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef | null;
  updatedBy: UserRef | null;
}

interface UserRef {
  _id: string;
  name: string;
}
interface UsersResponse {
  success: boolean;
  message: string;
  users: User[];
}

export default function UsersList() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [spinnerLoading, setSpinnerLoading] = useState(false);

  // Fetch all users
  const getAllClients = async () => {
    try {
      setSpinnerLoading(true);
      const { data } = await axios.get<UsersResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/all-clients`,
      );
      setAllUsers(data.users);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching clients");
      setAllUsers([]);
    } finally {
      setSpinnerLoading(false);
    }
  };

  useEffect(() => {
    getAllClients();
  }, []);

  // Update client status
  const handleStatusUpdate = async (userId: string, status: string) => {
    const isBlocking = status === "Blocked";

    const updatePromise = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/update-client/${userId}`,
      { status },
    );

    toast.promise(updatePromise, {
      loading: isBlocking ? "Blocking client..." : "Activating client...",
      success: (data) => {
        getAllClients();
        return (
          data.data.message ||
          `Client ${isBlocking ? "Blocked" : "Activated"} successfully`
        );
      },
      error: (error) => error?.response?.data?.message || "Update failed",
    });
  };

  return (
    <div className="container mx-auto py-8 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">Client List</span>
      </div>

      {/* Table */}
      <Table className="bg-[#3f4f5f7] rounded-lg overflow-hidden mt-3">
        <TableHeader className="bg-[#f4f5f7] dark:bg-gray-800">
          <TableRow>
            <TableHead className="dark:text-gray-100 font-extrabold">
              #
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Name
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Email
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Phone
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Role
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Status
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Created
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Updated
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {spinnerLoading ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-4 dark:text-gray-100"
              >
                <div className="flex justify-center items-center space-x-2 py-15">
                  <Spinner />
                  <span className="font-bold">Loading clients...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : allUsers.length > 0 ? (
            allUsers.map((user, index) => (
              <TableRow key={user._id} className="dark:hover:bg-gray-700">
                <TableCell className="dark:text-gray-100">
                  <b>{index + 1}</b>
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  <div className="flex gap-2 items-center">
                    <Avatar>
                      <AvatarImage
                        src={user?.avatar ?? "/demoAvatar.png"}
                        alt={user?.name ?? "User Avatar"}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="font-bold">{user?.name}</span>
                  </div>
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user?.email}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user?.phone}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  <Badge
                    className={`capitalize ${
                      user?.role === "Admin"
                        ? "bg-yellow-500 font-extrabold text-black"
                        : user?.role === "Moderator"
                          ? "bg-sky-500 font-bold text-white"
                          : "bg-gray-500 text-white"
                    }`}
                  >
                    {user?.role}
                  </Badge>
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  <Badge
                    className={`capitalize ${
                      user?.status === "Active"
                        ? "bg-green-700 font-bold text-white"
                        : ""
                    } ${
                      user?.status === "Blocked"
                        ? "bg-red-500 font-bold text-white"
                        : ""
                    }`}
                  >
                    {user?.status}
                  </Badge>
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {dayjs(user?.createdAt).format("DD-MMM-YYYY hh:mm A")}
                  {user?.createdBy && (
                    <div className="text-sm text-gray-500">
                      by {user?.createdBy?.name}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {dayjs(user?.updatedAt).fromNow()}
                  {user?.updatedBy && (
                    <div className="text-sm text-gray-500">
                      by {user?.updatedBy?.name}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        className={`flex items-center gap-2 cursor-pointer font-bold ${
                          user.status === "Active"
                            ? "text-destructive focus:text-destructive"
                            : "text-green-600 focus:text-green-600"
                        }`}
                        onClick={() =>
                          handleStatusUpdate(
                            user._id,
                            user.status === "Active" ? "Blocked" : "Active",
                          )
                        }
                      >
                        {user.status === "Active" ? (
                          <>
                            <Lock className="w-4 h-4" /> Block
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" /> Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-10 dark:text-gray-100 font-bold"
              >
                No Client Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
