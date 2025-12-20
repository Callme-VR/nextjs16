import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from "next";
import { Doc } from "@/convex/_generated/dataModel";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "Our Blog - Insights, Thoughts, and Trends",
  description: "Discover insights, thoughts, and trends from our team. Read our latest blog posts on technology, development, and innovation.",
  openGraph: {
    title: "Our Blog - Insights, Thoughts, and Trends",
    description: "Discover insights, thoughts, and trends from our team. Read our latest blog posts on technology, development, and innovation.",
    type: "website",
  },
};

// static content in this function
export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and trends from our team.
        </p>
      </div>

      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadingBlogList />
      </Suspense>
    </div>
  );
}

// streaming feature is implemented here
// this is the server code which is run after
// and cache working in this page with proper explanation

// Define fallback URL for blog post images
const fallbackUrl = "https://images.unsplash.com/photo-1761019646782-4bc46ba43fe9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Component to render blog posts grid
function BlogPostsGrid({ posts }: { posts: (Doc<"posts"> & { imageUrl?: string | null })[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.imageUrl || fallbackUrl}
              alt={post.title || "Blog post image"}
              fill
              className="rounded-t-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // Handle image loading errors
                const target = e.target as HTMLImageElement;
                target.src = fallbackUrl;
              }}
            />
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary transition-colors">
                {post.title || "Untitled Post"}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3 mt-2">
              {post.body || "No content available."}
            </p>
          </CardContent>
          <CardFooter>
            <Link
              className={buttonVariants({
                className: "w-full",
              })}
              href={`/blog/${post._id}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Component to show when no posts are available
function NoPosts() {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
    </div>
  );
}

// Component to show error state
function ErrorState() {
  return (
    <div className="text-center py-12">
      <p className="text-destructive text-lg">Failed to load blog posts. Please try again later.</p>
    </div>
  );
}

// Component that handles data fetching and state management
async function BlogListContent() {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  
  const data = await fetchQuery(api.posts.getposts);
  return data;
}

// Wrapper component that handles error states
async function LoadingBlogList() {
  let posts: Awaited<ReturnType<typeof BlogListContent>> | null = null;
  let hasError = false;

  try {
    posts = await BlogListContent();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    hasError = true;
  }

  if (hasError) {
    return <ErrorState />;
  }

  if (!posts || posts.length === 0) {
    return <NoPosts />;
  }

  return <BlogPostsGrid posts={posts} />;
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
