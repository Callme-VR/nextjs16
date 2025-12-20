"use client";

import { POST_SCHEMA } from "@/app/schema/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
// import { createBlogAction } from "@/app/action";
import { Id } from "@/convex/_generated/dataModel";

export default function CreateRoutePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mutation = useMutation(api.posts.CreatePost);
  const generateUploadUrl = useMutation(api.posts.generateImageUploadUrl);

  const form = useForm({
    resolver: zodResolver(POST_SCHEMA),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof POST_SCHEMA>) {
    startTransition(async () => {
      try {
        let imageStorageId: Id<"_storage"> | undefined;
        
        // Handle image upload if present
        if (values.image) {
          const uploadUrl = await generateUploadUrl();
          
          const uploadResult = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "Content-Type": values.image.type,
            },
            body: values.image,
          });
          
          if (!uploadResult.ok) {
            throw new Error("Failed to upload image");
          }
          
          const { storageId } = await uploadResult.json();
          imageStorageId = storageId;
        }

        // Handle the mutation client-side
        await mutation({
          body: values.content,
          title: values.title,
          imageStorageId: imageStorageId,
        });

        toast.success("created post successfully!");
        router.push("/");
      } catch (error) {
        toast.error("Failed to create post");
        console.error("Error creating post:", error);
      }
    });
  }

  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl text-accent-foreground tracking-tighter font-bold sm:text-5xl">
          Create Your Blogging Page
        </h1>

        <p className="text-xl text-muted-foreground tracking-tighter sm:text-2xl pt-2">
          Share Your thoughts and knowledge with the world
        </p>
      </div>

      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Get Started</CardTitle>
          <CardDescription className="text-center">
            Start creating your blog today
          </CardDescription>
        </CardHeader>
        {/* for the card components */}

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Super Cool Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="create super Cool Title."
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your content related to blogging"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Super cool blog content"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="mt-4 w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>create post</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
