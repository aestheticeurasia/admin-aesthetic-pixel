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
import { MoreHorizontal, Edit, Trash } from "lucide-react";

const users = [
  { id: 1, name: "John Doe", email: "john@gmail.com", role: "Super Admin" },
  { id: 2, name: "Jane Smith", email: "jane@gmail.com", role: "Admin" },
  { id: 3, name: "Alice Johnson", email: "alice@gmail.com", role: "User" },
  {
    id: 4,
    name: "Bob Williams",
    email: "bob@gmail.com",
    role: "Product Manager",
  },
  {
    id: 5,
    name: "Emma Brown",
    email: "emma@gmail.com",
    role: "Content Manager",
  },
];

export default function UsersList() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">Users List</span>
        <Button variant="destructive" className="font-bold cursor-pointer">
          Add User
        </Button>
      </div>

      <Table className="bg-[#3f4f5f7] rounded-lg overflow-hidden mt-3">
        <TableHeader>
          <TableRow>
            <TableHead className="dark:text-gray-100 font-extrabold">
              ID
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Name
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Email
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Role
            </TableHead>
            <TableHead className="dark:text-gray-100 font-extrabold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length ? (
            users.map((user) => (
              <TableRow key={user.id} className="dark:hover:bg-gray-700">
                <TableCell className="dark:text-gray-100">{user.id}</TableCell>
                <TableCell className="dark:text-gray-100">
                  {user.name}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user.email}
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {user.role}
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
                        onClick={() => alert(`Edit user ${user.id}`)}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive cursor-pointer font-bold"
                        onClick={() => alert(`Delete user ${user.id}`)}
                      >
                        <Trash className="w-4 h-4 font-bold" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center dark:text-gray-100">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
