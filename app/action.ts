import z from "zod";
import { POST_SCHEMA } from "./schema/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { gettoken } from "@/lib/auth-server";

export async function createBlogAction(values: z.infer<typeof POST_SCHEMA>) {
  const parsed = POST_SCHEMA.safeParse(values);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const token =  await gettoken();

  await fetchMutation(
    api.posts.CreatePost,
    {
      body: parsed.data.content,
      title: parsed.data.title,
    },
    {
      token,
    }
  );
  return redirect("/");
}
