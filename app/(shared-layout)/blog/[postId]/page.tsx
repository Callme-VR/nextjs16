import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import { metadata } from "@/app/layout";

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}


// dynamic metadata and better for seo and some how  for  dynamic routing

export async function generateMetadata({ params }: PostIdRouteProps) {
  const { postId } = await params
  const post = await fetchQuery(api.posts.getPostById, { postId: postId })

  if (!post) {
    return {
      title: "Post Not Found"
    };
  }
  return {
    title: post.title,
    description: post.body,
  }

}





export default async function PostIdPage({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });
  if (!post) {
    return (
      <div>
        <h1>No post found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href={"/blog"}
        className={buttonVariants({ variant: "outline" }) + " mb-4"}
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={post.title}
          fill
          className="object-cover hover:scale-120 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl tracking-tighter font-bold text-foreground">
          {post.title}
        </h1>

        <p className="tracking-tighter font-semibold text-muted-foreground">
          Posted on:
          {new Date(post._creationTime).toLocaleDateString("en-IN")}
        </p>

        <Separator className="my-9" />

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{post.body}</div>
        </div>
      </div>
      <Separator className="my-9" />

      <CommentSection />
    </div>
  );
}
