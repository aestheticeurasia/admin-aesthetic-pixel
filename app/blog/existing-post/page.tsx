"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import dayjs from "dayjs";
import { toast } from "sonner";
import axios from "axios";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface BlogResponse {
  success: boolean;
  message: string;
}

export default function ExistingPost() {
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [draftBlogToDelete, setDraftBlogToDelete] = useState<string | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);

  //get all blog

  const fetchAllBlogs = async () => {
    setSpinnerLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/blog/get-all-blogs`
      );
      setBlogs(data.blogs);
      setSpinnerLoading(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      setSpinnerLoading(false);
    }
  };

  //delete blog
  const handleDeleteBlog = async (blogToDelete: string) => {
    setDeleteLoading(true);
    const { data } = await axios.delete<BlogResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/blog/delete-blog/${blogToDelete}`
    );
    if (data.success) {
      toast.success(data.message);
      fetchAllBlogs();
    } else {
      toast.error(data.message);
    }
    setDeleteLoading(false);
    try {
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, [blogToDelete]);

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
                  colSpan={7}
                  className="text-center py-4 dark:text-gray-100"
                >
                  <div className="flex justify-center items-center space-x-2 py-15">
                    <Spinner />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : blogs.length > 0 ? (
              blogs.map((post, index) => (
                <TableRow key={post._id} className="dark:hover:bg-gray-700">
                  <TableCell className="dark:text-gray-100">
                    <b> {index + 1}</b>
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {post?.title}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {post?.category?.name}
                    <br />
                    {post?.subCategory?.name}
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
                    {dayjs(post?.createdAt).format("DD-MMM-YYYY hh:mm A")}
                    <br />
                    by {post?.createdBy?.name}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {dayjs(post?.updatedAt).fromNow()}
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
                          onClick={() => setBlogToDelete(post._id)}
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
                  colSpan={7}
                  className="text-center py-15 dark:text-gray-100 font-bold"
                >
                  No blogs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <AlertDialog
          open={!!blogToDelete}
          onOpenChange={(open) => !open && setBlogToDelete(null)}
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
                onClick={() => {
                  handleDeleteBlog(blogToDelete!);
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
