"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryStore } from "@/store/useCategory";
import axios from "axios";
import { FolderPlus, GitMerge, Layers, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainLoading, setMainLoading] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const { categories, fetchCategories, loading } = useCategoryStore();
  const [refreshing, setRefreshing] = useState(false);

  //fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  //refersh subcateogies
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchCategories(); // your function
    } finally {
      setRefreshing(false);
    }
  };

  //create category handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setMainLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/category/create-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //clear state
      setName("");
      setDescription("");
      setMainLoading(false);
      toast.success(data?.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setMainLoading(false);
    }
  };

  //create category handler
  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);
    const formData = new FormData();
    formData.append("name", subCategoryName);
    formData.append("parentCategory", parentCategory);
    formData.append("description", subCategoryDescription);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/sub-category/create-sub-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //clear state
      setSubCategoryName("");
      setParentCategory("");
      setSubCategoryDescription("");
      setSubLoading(false);
      toast.success(data?.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center py-10 px-4">
      <Tabs defaultValue="main-category" className="w-full max-w-lg">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Categories
          </h1>
          <p className="text-muted-foreground">
            Create new top-level categories or organize items into
            subcategories.
          </p>
        </div>

        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="main-category" className="cursor-pointer">
            <Layers className="w-4 h-4 mr-2" />
            Main Category
          </TabsTrigger>
          <TabsTrigger value="subcategory" className="cursor-pointer">
            <GitMerge className="w-4 h-4 mr-2" />
            Subcategory
          </TabsTrigger>
        </TabsList>

        {/* --- Main Category --- */}
        <TabsContent value="main-category">
          <Card>
            <CardHeader>
              <CardTitle>Add Main Category</CardTitle>
              <CardDescription>
                Create a root level category that can contain other
                subcategories.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateCategory}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="main-name">Name</Label>
                  <Input
                    id="main-name"
                    placeholder="e.g. Electronics, Clothing"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="main-description">Description</Label>
                  <Textarea
                    id="main-description"
                    placeholder="Describe what belongs in this category..."
                    className="min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full mt-5 cursor-pointer"
                  disabled={mainLoading}
                >
                  {mainLoading ? (
                    <>
                      <Spinner /> Creating Category...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Create Category
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* --- Subcategory --- */}
        <TabsContent value="subcategory">
          <Card>
            <CardHeader>
              <CardTitle>Add Subcategory</CardTitle>
              <CardDescription>
                Create a category nested under an existing parent.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleCreateSubCategory}>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="parent-category">Parent Category</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={parentCategory}
                        onValueChange={(value) => setParentCategory(value)}
                        required
                      >
                        <SelectTrigger
                          id="parent-category"
                          className="cursor-pointer w-full"
                        >
                          <SelectValue placeholder="Select a parent..." />
                        </SelectTrigger>

                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category._id}
                              className="cursor-pointer"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        id="refresh-button"
                        className="cursor-pointer"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                      >
                        <RotateCw
                          className={refreshing ? "animate-spin" : ""}
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-name">Name</Label>
                  <Input
                    id="sub-name"
                    placeholder="e.g. Laptops, T-Shirts"
                    required
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-description">Description</Label>
                  <Textarea
                    id="sub-description"
                    placeholder="Describe this subcategory..."
                    className="min-h-[100px]"
                    value={subCategoryDescription}
                    onChange={(e) => setSubCategoryDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full mt-5 cursor-pointer"
                >
                  {subLoading ? (
                    <>
                      <Spinner /> Creating Subcategory...
                    </>
                  ) : (
                    <>
                      <GitMerge className="w-4 h-4 mr-2" />
                      Create Subcategory
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
