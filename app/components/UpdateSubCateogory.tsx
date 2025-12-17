"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCategoryStore } from "@/store/useCategory";

interface CategoryFormProps {
  category: any;
  onSuccess: () => void;
}

export default function UpdateSubCategory({
  category,
  onSuccess,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const { categories, fetchCategories } = useCategoryStore();

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setDescription(category.description || "");
      setParentCategory(category.parentCategory || "");
    }
  }, [category]);

  const handleUpdateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("parentCategory", parentCategory);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/sub-category/update-sub-category/${category._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data?.message);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Update Sub-Category
        </h1>
      </div>

      <Card>
        <form onSubmit={handleUpdateSubCategory}>
          <CardContent className="space-y-4">
            {/* Parent Category */}
            <div className="space-y-2">
              <Label htmlFor="parent-category">Parent Category</Label>
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
                  {categories?.map((item: any) => (
                    <SelectItem
                      key={item._id}
                      value={item._id}
                      className="cursor-pointer"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="sub-name">Name</Label>
              <Input
                id="sub-name"
                placeholder="e.g. Smartphones"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="sub-slug">Slug</Label>
              <Input
                id="sub-slug"
                placeholder="e.g. smartphones"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="sub-description">Description</Label>
              <Textarea
                wrap="hard"
                id="sub-description"
                placeholder="Describe this sub-category..."
                className="min-h-[100px] resize-y overflow-x-hidden break-all"
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
              disabled={subLoading}
            >
              {subLoading ? (
                <>
                  <Spinner /> Updating Sub-Category...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Update Sub-Category
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
