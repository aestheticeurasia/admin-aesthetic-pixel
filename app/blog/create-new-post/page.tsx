import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function CreateNewPost() {
  return (
    <div className="container px-5">
      <div>
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
        </div>
      </form>
    </div>
  );
}
