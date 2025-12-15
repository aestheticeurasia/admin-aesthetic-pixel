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

  // prevent re-rendering issues
  // const config = useMemo(
  //   () => ({
  //     readonly: false,
  //     height: 400,
  //     uploader: {
  //       insertImageAsBase64URI: false,
  //       url: "/api/upload-editor-file",
  //       method: "POST",
  //     },
  //     removeButtons: ["about"],
  //   }),
  //   []
  // );

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
    <div className="container px-0 md:px-30">
      <div className="text-center mt-10">
        <h1 className="font-bold text-2xl">Create New Post</h1>
        <p className="mt-3 text-muted-foreground">
          This is the page where you can create a new blog post.
        </p>
      </div>
      <div className="mt-10">
        <h1 className="font-bold text-2xl">Post Details</h1>
        <p className="mt-3 text-muted-foreground">
          Fill in the information for your new blog
        </p>
      </div>
      <form action="">
        <div className="space-y-3 mt-10">
          <Label htmlFor="focusKeyphrase" className="text-lg font-bold">
            Focus Keyphrase
          </Label>
          <Input
            type="text"
            id="focusKeyphrase"
            name="focusKeyphrase"
            placeholder="Enter the focus keyphrase"
            className="py-6 bg-[#f6f7f9]"
            required
          />
        </div>
        <div className="space-y-3 mt-5">
          <Label htmlFor="seoTitle" className="text-lg font-bold">
            SEO Title
          </Label>
          <Input
            type="text"
            id="seoTitle"
            name="seoTitle"
            placeholder="Enter the SEO title"
            className="py-6 bg-[#f6f7f9]"
            required
          />
          <Progress value={70} className="h-2 mt-2" />
        </div>
        <div className="space-y-3 mt-5">
          <Label htmlFor="slug" className="text-lg font-bold">
            Slug
          </Label>
          <Input
            type="text"
            id="slug"
            name="slug"
            placeholder="Enter the slug"
            className="py-6 bg-[#f6f7f9]"
            required
          />
        </div>
        <div className="space-y-3 mt-5">
          <Label htmlFor="meta" className="text-lg font-bold">
            Meta Description
          </Label>
          <Textarea
            id="meta"
            name="meta"
            placeholder="Enter the meta description"
            className="bg-[#f6f7f9] h-32"
            required
          />
          <Progress value={70} className="h-2 mt-2" />
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full mt-5">
          <div className="w-full">
            <Label htmlFor="mainCategory" className="text-lg font-bold">
              Main Category
            </Label>

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
          <div className="w-full">
            <Label htmlFor="subCategory" className="text-lg font-bold">
              Sub Category
            </Label>

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
        </div>

        <div className="mt-5">
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
        <div className="mt-10">
          <Label htmlFor="blogText" className="text-2xl font-bold my-3">
            Blog Text
          </Label>
          {/* <JoditEditor
            name="blogText"
            ref={editor}
            value={content}
            config={config}
            onChange={(newContent) => {
              setContent(newContent);
              // onChange?.(newContent);
            }}
          /> */}
          <div className="border rounded-md p-2 bg-white dark:bg-neutral-900 min-h-[300px]">
            <BlockEditor value={""} onChange={setContent} />
          </div>
        </div>

        <Button
          variant="destructive"
          className="mt-10 mb-20 w-full md:w-auto px-10 py-4 cursor-pointer"
        >
          Publish Post
        </Button>
      </form>
    </div>
  );
}
