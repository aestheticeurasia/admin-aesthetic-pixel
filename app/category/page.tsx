"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  CornerDownRight,
  Layers,
  Plus,
  ChevronRight,
  ChevronDown,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import AddCategory from "../components/AddCategory";
import { Spinner } from "@/components/ui/spinner";

dayjs.extend(relativeTime);

// Interfaces
interface CatRef {
  _id: string;
  name: string;
}

interface SubCatRef {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory: string;
  createdAt: string;
  updatedAt: string;
  createdBy: CatRef | null;
  updatedBy: CatRef | null;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: SubCatRef | null;
  updatedBy: SubCatRef | null;
  subCategories: SubCategory[];
}

interface ApiResponse {
  success: boolean;
  categories: Category[];
}

interface CategoryResponse {
  success: boolean;
  message: string;
  users: Category[];
}

export default function CategoryTable() {
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteSubLoading, setDeleteSubLoading] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<string | null>(
    null
  );

  // FETCH ALL CATEGORIES
  const handleAllCategories = async () => {
    try {
      setSpinnerLoading(true);
      const { data } = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/category/categories-with-subcategories`
      );
      setAllCategories(data.categories);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setSpinnerLoading(false);
    }
  };

  // delete category
  const handleDeleteCategory = async () => {
    try {
      setDeleteLoading(true);
      const { data } = await axios.delete<CategoryResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/category/delete-category/${categoryToDelete}`
      );
      if (data.success) {
        toast.success(data.message);
        handleAllCategories();
        setCategoryToDelete(null);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // delete Sub category
  const handleDeleteSubCategory = async () => {
    try {
      setDeleteSubLoading(true);
      const { data } = await axios.delete<CategoryResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/sub-category/delete-sub-category/${subCategoryToDelete}`
      );
      if (data.success) {
        toast.success(data.message);
        handleAllCategories();
        setSubCategoryToDelete(null);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteSubLoading(false);
    }
  };

  useEffect(() => {
    handleAllCategories();
  }, []);

  // TOGGLE ROW
  const toggleRow = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <Card>
        {/* FIXED HEADER */}
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-20 bg-white dark:bg-neutral-900 border-b">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            Category Management
          </CardTitle>

          <Button
            variant="destructive"
            onClick={() => setCreateCategoryModalOpen(true)}
            disabled={spinnerLoading}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="px-5">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allCategories.map((category, i) => {
                  const isOpen = expanded[category?._id] ?? false;

                  return (
                    <React.Fragment key={category?._id}>
                      <TableRow className="font-medium">
                        <TableCell>
                          <button
                            onClick={() => toggleRow(category?._id)}
                            className="cursor-pointer"
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="px-5">{i + 1}</TableCell>

                        <TableCell>{category?.name}</TableCell>

                        <TableCell className="text-muted-foreground">
                          /{category?.slug}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {category?.description}
                        </TableCell>

                        <TableCell className="text-muted-foreground text-sm">
                          {dayjs(category.createdAt).format(
                            "DD-MMM-YYYY hh:mm A"
                          )}
                          <br />
                          by {category?.createdBy?.name}
                        </TableCell>

                        <TableCell className="text-muted-foreground text-sm">
                          {dayjs(category?.updatedAt).fromNow()}
                          <br />
                          by {category?.updatedBy?.name}
                        </TableCell>

                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => {
                              setCategoryToDelete(category?._id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* SUBCATEGORY ROWS */}
                      {isOpen &&
                        category?.subCategories.map((sub, index) => (
                          <TableRow key={sub?._id} className="bg-muted/20">
                            <TableCell className="px-5">
                              {/* Empty cell for alignment */}
                            </TableCell>
                            <TableCell className="px-5">
                              <span className="text-xs text-muted-foreground">
                                {index + 1}
                              </span>
                            </TableCell>

                            <TableCell className="flex items-center gap-2 pl-10">
                              <CornerDownRight className="h-4 w-4 text-muted-foreground/50" />
                              <span className="text-sm text-muted-foreground">
                                {sub?.name}
                              </span>
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                              /{sub.slug}
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                              {sub?.description}
                            </TableCell>

                            <TableCell className="text-muted-foreground text-xs">
                              {dayjs(sub?.createdAt).format(
                                "DD-MMM-YYYY hh:mm A"
                              )}
                              <br />
                              by {sub?.createdBy?.name}
                            </TableCell>

                            <TableCell className="text-muted-foreground text-xs">
                              {dayjs(sub.updatedAt).fromNow()}
                              <br />
                              by {sub?.updatedBy?.name}
                            </TableCell>

                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 cursor-pointer"
                                onClick={() => {
                                  setSubCategoryToDelete(sub._id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <Dialog
        open={createCategoryModalOpen}
        onOpenChange={setCreateCategoryModalOpen}
      >
        <DialogContent className="overflow-y-auto dark:bg-gray-900">
          <AddCategory
            onSuccess={() => {
              handleAllCategories();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Category Delete Alert */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Categories and related Sub-Categories will be deleted permanently
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
                handleDeleteCategory();
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

      {/* Sub-Category Delete Alert */}
      <AlertDialog
        open={!!subCategoryToDelete}
        onOpenChange={(open) => !open && setSubCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This Sub-Categories will be deleted permanently
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteSubLoading}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteSubCategory();
              }}
              disabled={deleteSubLoading}
            >
              {deleteSubLoading ? (
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
