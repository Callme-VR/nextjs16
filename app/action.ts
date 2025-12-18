import z from "zod";
import { POST_SCHEMA } from "./schema/blog";
import { redirect } from "next/navigation";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { revalidatePath } from "next/cache";

export async function createBlogAction(values: z.infer<typeof POST_SCHEMA>) {
  const parsed = POST_SCHEMA.safeParse(values);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  try {
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl, {},
    )

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-type": parsed.data.image?.type
      },
      body: parsed.data.image
    })
    if (!uploadResult.ok) {
      error: "Failed to upload image"
    }
    const { storageId } = await uploadResult.json()

  } catch (error) {
    error:"Fialed to create post"

  }
  revalidatePath("/blog")

  // This action now only handles validation and redirect
  // The actual mutation will be handled client-side
  return redirect("/blog");
}
