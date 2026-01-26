"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import BlogContentViewer from "@/app/components/BlockNoteViewer";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import dayjs from "dayjs";

interface Blog {
  _id: string;
  title: string;
  coverImage?: string;
  createdBy?: {
    name: string;
  };
  createdAt?: string;
  jsonContent: string;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/blog/get-blog/${slug}`,
        );
        setBlog(data.blogPost);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <p className="text-white">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="text-white">Blog not found</p>;
  }

  return (
    <div className="container mx-auto lg:p-10">
      <div className="lg:relative mt-3 mb-10 px-10">
        <div className="absolute left-4 sm:left-5 md:left-0 lg:left-0">
        </div>
        <h1 className="text-3xl text-white font-bold text-center">
          {blog?.title}
        </h1>
      </div>

      <div>
       <div className="px-10">
          <Image
            src={blog.coverImage || "https://images.unsplash.com/photo-1501504905252-473c47e087f8"}
            alt={blog.title}
            className="w-full h-64 object-cover mb-6 rounded-lg"
            width={800}
            height={400}
          />

        <p className="text-muted-foreground md:my-4 text-between flex flex-row justify-between text-sm md:px-10">
          <span className="flex gap-2 items-center"><User size={17}/> {blog?.createdBy?.name || "Admin"}</span>
          <span className="flex gap-2 items-center">
            <Clock size={17}/>
            {blog?.createdAt
              ? dayjs(blog?.createdAt).format("DD MMM YYYY")
              : dayjs().format("DD MMM YYYY")}
          </span>
        </p>
       </div>

        <div className="mt-8 text-white">
            <BlogContentViewer content={blog?.jsonContent} />
        </div>
      </div>
    </div>
  );
}
