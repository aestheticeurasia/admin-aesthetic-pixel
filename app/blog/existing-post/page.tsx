"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import {
  Edit,
  MoreHorizontal,
  Trash,
  Search,
  Plus,
  FileText,
  Calendar,
  User,
  AlertCircle
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Skeleton } from "@/components/ui/skeleton";

dayjs.extend(relativeTime);

// ... (Interfaces remain the same) ...

export default function ExistingPost() {
  // ... (State and Logic remain the same) ...
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllBlogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/blog/get-all-blogs`
      );
      setBlogs(data.blogs || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    if (!searchQuery) return blogs;
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blogs, searchQuery]);

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/blog/delete-blog/${blogToDelete}`
      );
      if (data.success) {
        toast.success(data.message);
        setBlogs((prev) => prev.filter((b) => b._id !== blogToDelete));
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setIsDeleting(false);
      setBlogToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog content, edit existing posts, or publish new ones.
          </p>
        </div>
        <Button asChild className="bg-red-700 cursor-pointer hover:bg-red-600 text-white py-2">
          <Link href="/blog/create">
            <Plus className="w-5 h-5" /> Create New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Existing Posts</CardTitle>
                    <CardDescription>
                        Total {blogs.length} posts found.
                    </CardDescription>
                </div>
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {/* Added Serial Number Header */}
                <TableHead className="w-[50px]">#</TableHead> 
                <TableHead className="w-[350px]">Post Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // 2. Added Skeleton for Serial Column
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><div className="space-y-2"><Skeleton className="h-4 w-[250px]" /><Skeleton className="h-3 w-[100px]" /></div></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredBlogs.length > 0 ? (
                filteredBlogs.map((post, index) => (
                  <TableRow key={post._id} className="group">
                    
                    {/* Render the Serial Number */}
                    <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link 
                            href={`/blog/existing-post/${post.slug}`} 
                            className="font-semibold hover:text-primary transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <span className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> /{post.slug}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{post.category?.name}</span>
                        {post.subCategory && (
                          <span className="text-xs text-muted-foreground">
                            {post.subCategory.name}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={post.status === "Published" ? "default" : "secondary"}
                        className={`
                          ${post.status === "Published" ? "bg-green-600 hover:bg-green-700" : ""}
                          ${post.status === "Unpublished" ? "bg-red-500 text-white hover:bg-red-600" : ""}
                        `}
                      >
                        {post.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            {post.createdBy?.name || "Unknown"}
                        </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2" title="Published At">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span>{dayjs(post.publishedAt).format("DD MMM, YYYY")}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Updated {dayjs(post.updatedAt).fromNow()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer dark:bg-[#131313] border-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/edit/${post._id}`} className="cursor-pointer flex w-full items-center">
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => setBlogToDelete(post._id)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {/* Updated colSpan to 7 to account for new column */}
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                        <p>No blogs found matching your criteria.</p>
                        {searchQuery && (
                            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2 cursor-pointer">
                                Clear search
                            </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Alert Dialog */}
      <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="dark:text-white cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 dark:text-white cursor-pointer"
              onClick={handleDeleteBlog}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}