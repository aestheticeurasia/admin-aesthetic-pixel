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
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import AddNewUser from "../components/CreateNewUser";
import axios from "axios";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
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
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">Users List</span>

        <Dialog open={addUserModalOpen} onOpenChange={setAddUserModalOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="font-bold cursor-pointer">
              Add User
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader />
            <AddNewUser />
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
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {spinnerLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-4 dark:text-gray-100"
              >
                Loading users...
              </TableCell>
            </TableRow>
          ) : allUsers.length > 0 ? (
            allUsers.map((user, index) => (
              <TableRow key={user._id} className="dark:hover:bg-gray-700">
                <TableCell className="dark:text-gray-100">{index + 1}</TableCell>
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
                  {user?.role}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user?.status}
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
