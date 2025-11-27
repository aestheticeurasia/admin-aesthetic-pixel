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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, Edit, Trash, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import AddNewUser from "../components/CreateNewUser";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: boolean;
  message: string;
  users: User[];
}

export default function UsersList() {
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [spinnerLoading, setSpinnerLoading] = useState(false);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      setSpinnerLoading(true);

      const res = await axios.get<UsersResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/all-users`
      );

      setAllUsers(res.data.users);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users");
    } finally {
      setSpinnerLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="container mx-auto py-8 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">Users List</span>

        <Dialog open={addUserModalOpen} onOpenChange={setAddUserModalOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="font-bold cursor-pointer flex items-center">
             <UserPlus className="font-bold"/> Add User
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader >
              <span className="text-xl font-bold">Add New User</span>
            </DialogHeader>
            <AddNewUser
              onClose={() => setAddUserModalOpen(false)}
              onUserCreated={getAllUsers}
            />
          </DialogContent>
        </Dialog>
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
                <div className="flex justify-center items-center space-x-2">
                  <Spinner />
                  <span>Loading users...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : allUsers.length > 0 ? (
            allUsers.map((user, index) => (
              <TableRow key={user._id} className="dark:hover:bg-gray-700">
                <TableCell className="dark:text-gray-100">
                  <b> {index + 1}</b>
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user?.name}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user?.email}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user?.phone}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  <Badge
                    className={`
    capitalize
    ${
      user?.role === "Admin"
        ? "bg-yellow-500 font-extrabold text-black"
        : user?.role === "Moderator"
        ? "bg-sky-500 font-bold text-white"
        : "bg-gray-500 text-white"
    }
  `}
                  >
                    {user?.role}
                  </Badge>
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  <Badge
                    className={`
    capitalize
    ${user?.status === "Active" ? "bg-blue-600 font-bold text-white" : ""}
    ${user?.status === "Blocked" ? "bg-red-600 font-bold text-white" : ""}
  `}
                  >
                    {user?.status}
                  </Badge>
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {dayjs(user?.createdAt).format("DD-MMM-YYYY hh:mm A")}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {dayjs(user?.updatedAt).format("DD-MMM-YYYY hh:mm A")}
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
                        className="flex items-center gap-2 cursor-pointer font-bold"
                        onClick={() => alert(`Edit user ${user._id}`)}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive cursor-pointer font-bold"
                        onClick={() => alert(`Delete user ${user._id}`)}
                      >
                        <Trash className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-4 dark:text-gray-100"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
