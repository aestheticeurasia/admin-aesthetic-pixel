"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryStore } from "@/store/useCategory";
import { useSubCategoryStore } from "@/store/useSubCategory";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Button } from "@/components/ui/button";
import BlockEditor from "@/app/components/BlockNoteEditor";

export default function CreateNewPost() {
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { categories, fetchCategories, loading } = useCategoryStore();
  const {
    subCategories,
    fetchSubCategories,
    loading: subLoading,
  } = useSubCategoryStore();
  const [parentCategory, setParentCategory] = useState("");
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const filteredSubs = subCategories.filter(
    (sub) => (sub.parentCategory as any)?._id === parentCategory
  );

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (subCategories.length === 0) fetchSubCategories();
  }, []);

  return (
    <div className="container px-0 md:px-20">
      <div className="grid lg:grid-cols-12 gap-10">
        <section className="col-span-7">
          <div className="space-y-3 mt-5">
            <Label htmlFor="title" className="text-lg font-bold">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Post Title"
              className="h-11 bg-[#f6f7f9] font-bold text-xl"
              required
            />
          </div>
          <div className="space-y-3 mt-5">
            <Label htmlFor="content" className="text-lg font-bold">
              Post Content
            </Label>
            <div className="border-2 rounded-md p-2 dark:bg-neutral-900 min-h-[500px]">
              <BlockEditor value={""} onChange={setContent} />
            </div>
          </div>
        </section>

        {/* Setting Section */}
        <section className="col-span-5 min-h-screen overflow-y-auto pb-10">
          <div className="border-2 rounded-md p-4">
            <h1 className="text-xl font-bold">Post Setting</h1>
            <div className="w-full mt-5">
              <Label htmlFor="mainCategory">Main Category</Label>

              <Select
                name="mainCategory"
                onValueChange={(value) => setParentCategory(value)}
              >
                <SelectTrigger className="w-full bg-[#f6f7f9] py-6 mt-2">
                  <SelectValue placeholder="Select main category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full mt-5">
              <Label htmlFor="subCategory">Sub Category</Label>

              <Select name="subCategory" disabled={!parentCategory}>
                <SelectTrigger className="w-full bg-[#f6f7f9] py-6 mt-2">
                  <SelectValue
                    placeholder={
                      !parentCategory
                        ? "Select parent category first"
                        : filteredSubs.length === 0
                        ? "No subcategories found"
                        : "Select sub category"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sub Categories</SelectLabel>

                    {filteredSubs.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No subcategories under this category
                      </div>
                    ) : (
                      filteredSubs.map((sub) => (
                        <SelectItem key={sub._id} value={sub._id}>
                          {sub.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 mt-5">
              <Label htmlFor="tag">Tag</Label>
              <Input
                type="text"
                id="tag"
                name="tag"
                placeholder="Post Tag"
                className="h-11 bg-[#f6f7f9]"
                required
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div className="border-2 p-4 mt-5 rounded-md">
            <div className="">
              <Label htmlFor="coverPhoto" className="text-lg font-bold">
                Cover Photo
              </Label>

              <div
                className="mt-3 w-full h-56 border-3 border-dashed rounded-md flex items-center justify-center cursor-pointer dark:bg-gray-900 bg-[#f6f7f9] hover:bg-gray-100 transition"
                onClick={() => document.getElementById("coverPhoto")?.click()}
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Cover preview"
                    width={100}
                    height={50}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 text-center p-4">
                    <div className="p-4 rounded-full bg-background border shadow-sm">
                      <CloudUpload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        Click to upload cover photo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden input */}
              <input
                id="coverPhoto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverPhotoChange}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="border-2 p-4 mt-5 rounded-md">
            <div className=" mt-2">
              <Label htmlFor="metaDescription" className="text-lg font-bold">
                Meta Description
              </Label>

              <Textarea
                id="metaDescription"
                name="metaDescription"
                placeholder="Meta Description"
                className="bg-[#f6f7f9] mt-2"
                rows={6}
              />
            </div>
            <div className=" mt-2">
              <Label htmlFor="metaDescription" className="text-lg font-bold">
                Excerpt
              </Label>

              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="Those text will show on the card"
                className="bg-[#f6f7f9] mt-2"
                rows={6}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
