"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  CalendarDays,
  CloudUpload,
  ChevronLeft,
  Save,
  Settings2,
  Globe,
  ImageIcon,
  Search,
  SquareCheckBig,
  StickyNote,
} from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

// Custom Components & Stores
import BlockEditor from "@/app/components/BlockNoteEditor";
import { useCategoryStore } from "@/store/useCategory";
import { useSubCategoryStore } from "@/store/useSubCategory";

export default function CreateNewPost() {
  const router = useRouter();
  const [createLoading, setCreateLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [metaDescription, setMetaDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState("Draft");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Store & Logic
  const { categories, fetchCategories } = useCategoryStore();
  const { subCategories, fetchSubCategories } = useSubCategoryStore();
  const [parentCategory, setParentCategory] = useState("");

  const filteredSubs = subCategories.filter(
    (sub) => (sub.parentCategory as any)?._id === parentCategory,
  );

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (subCategories.length === 0) fetchSubCategories();
  }, []);

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
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
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      toast.success(res.data?.message || "Post created successfully");
      router.push("/blog/existing-post/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-500">
      <form onSubmit={handleCreateBlog}>
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/60 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  Post Editor
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-indigo-600 dark:text-zinc-500 font-bold italic">
                  Drafting mode
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700 px-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 cursor-pointer font-bold"
                disabled={createLoading}
              >
                {createLoading ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Publish
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-col lg:flex-row gap-10 p-6 lg:p-10 max-w-[1600px] mx-auto">
          {/* Editor Column */}
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <Label className="text- font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">
                Article Headline
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title..."
                className=" h-12 text-zinc-900 dark:text-zinc-100"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-3">
                <Label className="font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">
                  Story Content
                </Label>
              </div>
              <div
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0c] 
              shadow-xl dark:shadow-2xl min-h-screen p-3"
              >
                <BlockEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Settings Sidebar  */}
          <aside className="w-full lg:w-[420px] space-y-6">
            {/* Categorization */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 p-6 space-y-5 shadow-sm dark:shadow-none">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-zinc-500 flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5 text-red-500" />{" "}
                Categorization
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500 dark:text-zinc-400 ml-1 font-medium">
                    Main Category
                  </Label>
                  <Select
                    value={parentCategory}
                    onValueChange={(v) => {
                      setParentCategory(v);
                      setCategory(v);
                      setSubCategory("");
                    }}
                  >
                    <SelectTrigger className="bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 h-12 rounded-xl focus:ring-red-600 w-full cursor-pointer transition-colors">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat._id}
                          value={cat._id}
                          className="cursor-pointer"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500 dark:text-zinc-400 ml-1 font-medium">
                    Sub Category
                  </Label>
                  <Select
                    disabled={!parentCategory}
                    value={subCategory}
                    onValueChange={setSubCategory}
                  >
                    <SelectTrigger className="bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 h-12 rounded-xl focus:ring-red-600 cursor-pointer w-full transition-colors">
                      <SelectValue placeholder="Select Sub Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200">
                      {filteredSubs.map((sub) => (
                        <SelectItem
                          key={sub?._id}
                          value={sub?._id}
                          className="cursor-pointer"
                        >
                          {sub?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 p-6 shadow-sm dark:shadow-none">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-zinc-500 mb-4 flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-red-500" /> Cover Photo
              </h2>
              <div
                className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black transition hover:border-red-400 dark:hover:border-zinc-600"
                onClick={() => document.getElementById("coverPhoto")?.click()}
              >
                {previewUrl ? (
                  <>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20 dark:bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
                      <CloudUpload className="text-white h-8 w-8" />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <CloudUpload className="h-6 w-6 text-zinc-300 dark:text-zinc-700 mb-2" />
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">
                      Upload High-Res Image
                    </p>
                  </div>
                )}
              </div>
              <input
                id="coverPhoto"
                type="file"
                accept="image/*"
                className="hidden cursor-pointer"
                onChange={handleCoverPhotoChange}
              />
            </div>

            {/* SEO & Excerpt*/}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 p-6 space-y-5 shadow-sm dark:shadow-none">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-zinc-500 flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-red-500" /> Search
                Optimization
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500 dark:text-zinc-400 ml-1 font-medium">
                    Meta Description
                  </Label>
                  <Textarea
                    placeholder="Brief summary for Google results..."
                    className="bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 rounded-xl resize-none text-xs leading-relaxed focus:ring-red-600 text-zinc-900 dark:text-zinc-200"
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500 dark:text-zinc-400 ml-1 font-medium">
                    Excerpt
                  </Label>
                  <Textarea
                    placeholder="Short teaser for blog cards..."
                    className="bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 rounded-xl resize-none text-xs leading-relaxed focus:ring-red-600 text-zinc-900 dark:text-zinc-200"
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Publishing Panel */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 p-6 space-y-6 shadow-sm dark:shadow-none">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-zinc-500 flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-red-500" /> Distribution
              </h2>

              <RadioGroup
                value={status}
                onValueChange={setStatus}
                className="flex gap-2"
              >
                <div className="flex-1">
                  <RadioGroupItem
                    value="Draft"
                    id="draft"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="draft"
                    className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 text-[11px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600 transition-all peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 dark:peer-data-[state=checked]:bg-transparent peer-data-[state=checked]:text-red-600 dark:peer-data-[state=checked]:text-white cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <StickyNote className="mr-2 h-4 w-4" /> Draft
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem
                    value="Published"
                    id="published"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="published"
                    className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 text-[11px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600 transition-all peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 dark:peer-data-[state=checked]:bg-transparent peer-data-[state=checked]:text-red-600 dark:peer-data-[state=checked]:text-white cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <SquareCheckBig className="mr-2 h-4 w-4" /> Public
                  </Label>
                </div>
              </RadioGroup>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                <Label className="text-[10px] uppercase font-black text-zinc-400 dark:text-zinc-600 ml-1">
                  Schedule Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild className="cursor-pointer">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 h-12 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                    >
                      <CalendarDays className="mr-3 h-4 w-4 text-red-500" />
                      {date
                        ? dayjs(date).format("MMMM D, YYYY")
                        : "Publish Now"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                    align="end"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </aside>
        </main>
      </form>
    </div>
  );
}
