"use client";

import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Loader2,
  Plus,
  FolderTree,
} from "lucide-react";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AddCategory from "./add-category/page";

interface ParentDetails {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  parentCategory: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedCategory {
  _id: string;
  parentDetails: ParentDetails;
  subCategories: SubCategory[];
}

interface ApiResponse {
  success: boolean;
  grouped: GroupedCategory[];
}

export default function CategoriesPage() {
  const [data, setData] = useState<GroupedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/sub-category/by-parent`
      );
      const json: ApiResponse = await response.json();

      if (json.success) {
        setData(json.grouped);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers ---
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (id: string, type: "parent" | "sub") => {
    // Replace this console log with your Router push or Modal open logic
    console.log(`EDIT ${type} ID:`, id);
    toast.info(`Editing ${type} category: ${id}`);
  };

  const handleDelete = async (id: string, type: "parent" | "sub") => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    console.log(`DELETE ${type} ID:`, id);
    toast.success(`${type} category deleted (mock)`);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading category structure...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderTree className="h-8 w-8 text-primary" />
            Category Manager
          </h1>
          <p className="text-muted-foreground">
            View and manage parent categories and their nested sub-categories.
          </p>
        </div>
        <Button
          variant="destructive"
          className="cursor-pointer font-bold"
          onClick={() => {
            setCreateCategoryModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 font-bold" /> Create New
        </Button>
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Structure View</CardTitle>
          <CardDescription>
            {data.length} Parent Categories found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((group) => {
                const parent = group.parentDetails;
                const subs = group.subCategories;
                const isExpanded = expandedRows[group._id];
                const hasChildren = subs && subs.length > 0;

                return (
                  <React.Fragment key={group._id}>
                    <TableRow
                      className={`hover:bg-muted/50 transition-colors ${
                        isExpanded ? "bg-muted/30" : ""
                      }`}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 cursor-pointer"
                          onClick={() => toggleRow(group._id)}
                          disabled={!hasChildren}
                        >
                          {hasChildren ? (
                            isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-semibold text-base">
                        {parent.name}
                        {hasChildren && !isExpanded && (
                          <Badge
                            variant="secondary"
                            className="ml-2 text-[10px] h-5 px-1.5"
                          >
                            {subs.length}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        /{parent.slug}
                      </TableCell>
                      <TableCell>
                        <Badge>Parent</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(parent._id, "parent")}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(parent._id, "parent")}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* CHILD ROWS (Collapsed Logic) */}
                    {isExpanded &&
                      subs.map((sub) => (
                        <TableRow
                          key={sub._id}
                          className="bg-slate-50 dark:bg-slate-900/40 border-b-0"
                        >
                          <TableCell className="border-r border-transparent"></TableCell>
                          <TableCell className="pl-6 relative">
                            {/* Visual Tree Connector */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-muted-foreground/50"></div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {sub.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">
                            /{sub.slug}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs h-5">
                              Sub
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(sub._id, "sub")}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDelete(sub._id, "sub")}
                              >
                                <Trash2 className="h-3 w-3 hover:text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={createCategoryModalOpen}
        onOpenChange={setCreateCategoryModalOpen}
      >
        <DialogContent className="sm:max-w-[1100px] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <span className="text-xl font-bold">Add New Category</span>
          </DialogHeader>
          <AddCategory />
        </DialogContent>
      </Dialog>
    </div>
  );
}
