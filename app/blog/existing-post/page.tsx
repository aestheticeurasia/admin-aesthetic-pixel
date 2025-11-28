"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import dayjs from "dayjs";

const recentPosts = [
  {
    _id: "121",
    title: "Understanding React Hooks",
    date: "2024-06-15",
    views: 1500,
    status: "Published",
    category: "React",
    tag: "Hooks",
    postBy: "John Doe",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-10T12:00:00Z",
  },
  {
    _id: "122",
    title: "Advanced TypeScript Tips",
    date: "2024-06-10",
    views: 1200,
    status: "Draft",
    category: "TypeScript",
    tag: "Advanced",
    postBy: "Jane Smith",
    createdAt: "2024-06-02T11:00:00Z",
    updatedAt: "2024-06-11T13:00:00Z",
  },
  {
    _id: "123",
    title: "CSS Grid vs Flexbox",
    date: "2024-06-05",
    views: 900,
    status: "Published",
    category: "CSS",
    tag: "Layout",
    postBy: "Alice Johnson",
    createdAt: "2024-06-03T12:00:00Z",
    updatedAt: "2024-06-12T14:00:00Z",
  },
  {
    _id: "124",
    title: "TypeScript Tips",
    date: "2024-06-05",
    views: 900,
    status: "Unpublished",
    category: "TypeScript",
    tag: "Tips",
    postBy: "Bob Brown",
    createdAt: "2024-06-04T13:00:00Z",
    updatedAt: "2024-06-13T15:00:00Z",
  },
  {
    _id: "125",
    title: "CSS Grid vs Flexbox",
    date: "2024-06-05",
    views: 900,
    status: "Unpublished",
    category: "CSS",
    tag: "Layout",
    postBy: "Charlie Davis",
    createdAt: "2024-06-05T14:00:00Z",
    updatedAt: "2024-06-14T16:00:00Z",
  },
];

export default function ExistingPost() {
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [draftBlogToDelete, setDraftBlogToDelete] = useState<string | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  return (
    <div className="mx-0 md:mx-5">
      <section>
        <h3 className="font-bold text-xl mb-5 mt-10">Exisiting Posts</h3>
            <Table className="bg-[#3f4f5f7] rounded-lg overflow-hidden">
              <TableHeader className="bg-[#f4f5f7] dark:bg-gray-800">
                <TableRow>
                  <TableHead className="dark:text-gray-100 font-extrabold">
                    #
                  </TableHead>
                  <TableHead className="dark:text-gray-100 font-extrabold">
                    Title
                  </TableHead>
                  <TableHead className="dark:text-gray-100 font-extrabold">
                    Category
                  </TableHead>
                  <TableHead className="dark:text-gray-100 font-extrabold">
                    Status
                  </TableHead>
                  <TableHead className="dark:text-gray-100 font-extrabold">
                    Tag
                  </TableHead>
                  <TableHead className="dark:text-gray-100 font-extrabold">
                    Post By
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
                        <span>Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : recentPosts.length > 0 ? (
                  recentPosts.map((post, index) => (
                    <TableRow key={post._id} className="dark:hover:bg-gray-700">
                      <TableCell className="dark:text-gray-100">
                        <b> {index + 1}</b>
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        {post.title}
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        {post.category}
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        <Badge
                          className={`
    capitalize
    ${post?.status === "Published" ? "bg-green-700 font-bold text-white" : ""}
    ${post?.status === "Unpublished" ? "bg-red-500 font-bold text-white" : ""}
  `}
                        >
                          {post?.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        {post.tag}
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        {post.postBy}
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        {dayjs(post?.createdAt).format("DD-MMM-YYYY hh:mm A")}
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        {dayjs(post?.updatedAt).format("DD-MMM-YYYY hh:mm A")}
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
                              onClick={() => alert(`Edit user ${post._id}`)}
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-destructive cursor-pointer font-bold"
                              onClick={() => setDraftBlogToDelete(post._id)}
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
        <AlertDialog
          open={!!draftBlogToDelete}
          onOpenChange={(open) => !open && setDraftBlogToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                blog, including all its data.
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
      </section>
    </div>
  );
}
