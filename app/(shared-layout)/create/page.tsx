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

export default function CreateRoutePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mutation = useMutation(api.posts.CreatePost);

  const form = useForm({
    resolver: zodResolver(POST_SCHEMA),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof POST_SCHEMA>) {
    startTransition(async () => {
      mutation({
        body: values.content,
        title: values.title,
      });
      toast.success("created post successfully!");
      router.push("/");
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

      <Card className="w-full max-5-xl mx-auto">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Start creating your blog today</CardDescription>
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
            </FieldGroup>
            <Button type="submit" className="mt-4 w-full" disabled={isPending}>
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
