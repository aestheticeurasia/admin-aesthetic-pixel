"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCategoryStore } from "@/store/useCategory";
import { useSubCategoryStore } from "@/store/useSubCategory";
import { CalendarDays, CloudUpload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import BlockEditor from "@/app/components/BlockNoteEditor";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function CreateNewPost() {
  const [createLoading, setCreateLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [tag, setTag] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [metaDescription, setMetaDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState("Draft");
  // Unified date state
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { categories, fetchCategories, loading } = useCategoryStore();
  const {
    subCategories,
    fetchSubCategories,
    loading: subLoading,
  } = useSubCategoryStore();
  const [parentCategory, setParentCategory] = useState("");

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

  //create blog
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("jsonContent", content);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);
    formData.append("metaDescription", metaDescription);
    formData.append("excerpt", excerpt);
    formData.append("status", status);
    if (date) formData.append("publishedAt", date.toISOString());

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/blog/create-blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //reset form
      setTitle("");
      setContent(null);
      setCategory(null);
      setSubCategory("");
      setCoverPhoto(null);
      setPreviewUrl(null);
      setMetaDescription("");
      setExcerpt("");
      setStatus("Draft");
      setDate(null);
      toast.success(res.data?.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message);
    } finally {
      setCreateLoading(false);
    }
  };


  return (
    <div className="container">
      <form onSubmit={handleCreateBlog}>
        <div className="flex justify-between items-center p-5">
          <h1 className="text-3xl font-bold mb-5">Create New Post</h1>
          <div>
            <Button
              type="submit"
              className="cursor-pointer"
              variant="destructive"
              disabled={createLoading}
            >
              {createLoading && <Spinner />}
              Save
            </Button>
          </div>
        </div>
        <div className="grid lg:grid-cols-12 gap-10 px-0 md:px-20">
          <section className="lg:col-span-7">
            <div className="space-y-3 mt-5">
              <Label htmlFor="title" className="text-lg font-bold">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                <BlockEditor value={content} onChange={setContent} />
              </div>
            </div>
          </section>

          {/* Setting Section */}
          <section className="lg:col-span-5">
            <div className="border-2 rounded-md p-4">
              <h1 className="text-xl font-bold border-b-2 pb-2">
                Post Setting
              </h1>
              <div className="w-full mt-5">
                <Label htmlFor="mainCategory">Main Category</Label>

                <Select
                  name="mainCategory"
                  value={parentCategory}
                  onValueChange={(value) => {
                    setParentCategory(value);
                    setCategory(value);
                    setSubCategory("");
                  }}
                >
                  <SelectTrigger className="w-full bg-[#f6f7f9] py-6 mt-2">
                    <SelectValue placeholder="Select main category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem disabled value="no-category">
                        No categories found
                      </SelectItem>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full mt-5">
                <Label htmlFor="subCategory">Sub Category</Label>

                <Select
                  name="subCategory"
                  disabled={!parentCategory}
                  value={subCategory}
                  onValueChange={(value) => setSubCategory(value)}
                >
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
              {/* <div className="space-y-3 mt-5">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  type="text"
                  id="tag"
                  name="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Post Tag"
                  className="h-11 bg-[#f6f7f9]"
                  required
                />
              </div> */}
            </div>

            {/* Cover Photo */}
            <div className="border-2 p-4 mt-5 rounded-md">
              <div>
                <Label htmlFor="coverPhoto" className="text-lg font-bold pb-2">
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
                      <div className="p-4 rounded-full bg-red-700 border shadow-sm">
                        <CloudUpload className="h-8 w-8 text-white" />
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
              <h1 className="text-xl font-bold pb-2 border-b-2">SEO</h1>
              <div className=" mt-5">
                <Label htmlFor="metaDescription">Meta Description</Label>

                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  placeholder="Meta Description"
                  className="bg-[#f6f7f9] mt-2"
                  rows={6}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </div>
              <div className=" mt-2">
                <Label htmlFor="excerpt">Excerpt</Label>

                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Those text will show on the card"
                  className="bg-[#f6f7f9] mt-2"
                  rows={6}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>
            </div>

            {/* Published */}
            <div className="border-2 p-4 mt-5 rounded-md">
              <h1 className="text-xl font-bold pb-2 border-b-2">Publishing</h1>
              <div className="mt-5 space-y-3">
                <Label htmlFor="metaDescription">Status</Label>
                <RadioGroup
                  defaultValue="Draft"
                  onValueChange={setStatus}
                  value={status}
                >
                  <div className="flex items-center gap-3 py-2">
                    <RadioGroupItem
                      value="Draft"
                      id="r1"
                      className="cursor-pointer "
                    />
                    <Label htmlFor="r1" className="cursor-pointer">
                      Draft
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <RadioGroupItem
                      value="Published"
                      id="r2"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="r2" className="cursor-pointer">
                      Published
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <hr className="my-5" />
              <div className="space-y-3">
                <Label htmlFor="date" className="px-1">
                  Publish Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal h-11 cursor-pointer"
                    >
                      {date ? dayjs(date).format("DD MMM YYYY") : "Select date"}
                      <CalendarDays />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
