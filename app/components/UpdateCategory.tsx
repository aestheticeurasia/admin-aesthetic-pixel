"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CategoryFormProps {
  category: any;
  onSuccess: () => void;
}

export default function UpdateCategory({
  category,
  onSuccess,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setDescription(category.description || "");
    }
  }, [category]);

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setMainLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/category/update-category/${category._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data?.message);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setMainLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Update Category</h1>
      </div>

      <Card>
        <form onSubmit={handleUpdateCategory}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main-name">Name</Label>
              <Input
                id="main-name"
                placeholder="e.g. Electronics"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-slug">Slug</Label>
              <Input
                id="main-slug"
                placeholder="e.g. electronics"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-description">Description</Label>
              <Textarea
              wrap="hard"
                id="main-description"
                placeholder="Describe this category..."
                className="min-h-[100px]  resize-y overflow-x-hidden break-all"
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
                  <Spinner /> Updating Category...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Update Category
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
