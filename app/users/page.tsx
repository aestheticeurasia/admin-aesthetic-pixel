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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import AddNewUser from "../components/CreateNewUser";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateUser from "../components/UpdateUser";

dayjs.extend(relativeTime);

interface User {
  _id: string;
  name: string;
  avatar: string | null;
  email: string;
  phone: string;
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
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

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

  // delete user
  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      const { data } = await axios.delete<UsersResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/delete-user/${userToDelete}`
      );
      if (data.success) {
        toast.success(data.message);
        getAllUsers();
        setUserToDelete(null);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
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
            <Button
              variant="destructive"
              className="font-bold cursor-pointer flex items-center"
            >
              <UserPlus className="font-bold" /> Add User
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
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
                <div className="flex justify-center items-center space-x-2 py-15">
                  <Spinner />
                  <span className="font-bold">Loading users...</span>
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
                  <div className="flex gap-2 items-center">
                    <Avatar>
                      <AvatarImage
                        src={user?.avatar ?? "/demoAvatar.png"}
                        alt={user?.name ?? "User Avatar"}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="font-bold"> {user?.name}</span>
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
    ${user?.status === "Active" ? "bg-green-700 font-bold text-white" : ""}
    ${user?.status === "Blocked" ? "bg-red-500 font-bold text-white" : ""}
  `}
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
                  {user?.createdBy && (
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
                        className="flex items-center gap-2 cursor-pointer font-bold"
                        onClick={() => {
                          setSelectedUser(user);
                          setUpdateUserModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive cursor-pointer font-bold"
                        onClick={() => setUserToDelete(user._id)}
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
                colSpan={9}
                className="text-center py-10 dark:text-gray-100 font-bold"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add user modal */}
      <Dialog open={updateUserModalOpen} onOpenChange={setUpdateUserModalOpen}>
        <DialogContent className="sm:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <span className="text-xl font-bold">Update User</span>
          </DialogHeader>

          {selectedUser && (
            <UpdateUser
              initialData={selectedUser}
              onClose={() => {
                setUpdateUserModalOpen(false);
                setSelectedUser(null);
              }}
              onSuccess={getAllUsers}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Delete Alert */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              user, including their all Data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteLoading}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="text-white" /> Deleting...
                </div>
              ) : (
                <>
                  <Trash className="w-4 h-4" /> Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
