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
import {
  Activity,
  Clock,
  Edit,
  Eye,
  Image,
  MoreHorizontal,
  NotebookPen,
  NotepadText,
  Settings,
  Trash,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import dayjs from "dayjs";

export default function BlogPage() {
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [draftBlogToDelete, setDraftBlogToDelete] = useState<string | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [spinnerLoading, setSpinnerLoading] = useState(false);

  const dashboardCards = [
    {
      icon: <Image className="h-6 w-6 text-red-500" />,
      title: "Total Photos",
      number: "1,234",
      content: "+12% from last month",
      iconBgColor: "bg-red-500/10",
      contentTextColor: "text-red-500",
    },
    {
      icon: <NotebookPen className="h-6 w-6 text-red-500" />,
      title: "Blog Posts",
      number: "42",
      content: "+5% from last month",
      iconBgColor: "bg-red-500/10",
      contentTextColor: "text-red-500",
    },
    {
      icon: <Eye className="h-6 w-6 text-red-500" />,
      title: "Gallery Views",
      number: "892",
      content: "+23% from last month",
      iconBgColor: "bg-red-500/10",
      contentTextColor: "text-red-500",
    },
    {
      icon: <Activity className="h-6 w-6 text-red-500" />,
      title: "Engagement",
      number: "64.2%",
      content: "-8% from last month",
      iconBgColor: "bg-red-500/10",
      contentTextColor: "text-red-500",
    },
  ];

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
  return (
    <div>
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:py-10">
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            className="p-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {card.title}
                </h3>
                <div className={`p-2 rounded-lg ${card.iconBgColor}`}>
                  {card.icon}
                </div>
              </div>

              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {card.number}
              </p>

              <p
                className={`text-sm ${card.contentTextColor} dark:text-red-400`}
              >
                {card.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-1 gap-8">
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Recent Posts</h3>
                  <Button
                    variant="secondary"
                    className="font-bold cursor-pointer"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentPosts.map((post, index) => (
                  <div
                    className="border p-3 mx-2 my-5 rounded-lg shadow-sm flex justify-between items-center dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    key={index}
                  >
                    <div className="flex flex-col gap-2">
                      <h1 className="font-bold">{post?.title}</h1>
                      <p className="text-sm text-gray-500 flex gap-4">
                        <span className="flex items-center gap-1">
                          <Clock size={16} /> {post?.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={18} /> Views: {post?.views}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-red-200 text-red-800 rounded-md font-bold">
                        {post?.status}
                      </Badge>
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
                            onClick={() => alert(`Edit blog ${post._id}`)}
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
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <h3 className="font-bold text-lg">Quick Actions</h3>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <button className="flex flex-col items-center justify-center py-4 cursor-pointer text-white text-md font-bold bg-red-700 hover:bg-red-800 rounded-md gap-1">
                    <Edit />
                    New Post
                  </button>
                  <button className="flex flex-col items-center justify-center py-4 cursor-pointer text-white text-md font-bold bg-red-700 hover:bg-red-800 rounded-md gap-1">
                    <Settings />
                    Settings
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="flex flex-col items-center justify-center py-4 cursor-pointer text-white text-md font-bold bg-red-700 hover:bg-red-800 rounded-md gap-1">
                    <NotepadText /> Drafts
                  </button>
                  <button className="flex flex-col items-center justify-center py-4 cursor-pointer text-white text-md font-bold bg-red-700 hover:bg-red-800 rounded-md gap-1">
                    <Users />
                    Subscribers
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

      {/* Draft Post */}
      <section className="mt-10">
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Draft Posts</h3>
              <Button variant="secondary" className="font-bold cursor-pointer">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

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
