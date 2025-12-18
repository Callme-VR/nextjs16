"use client";
import { Loader, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { commentSchema } from "@/app/schema/comment";
import { Textarea } from "../ui/textarea";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import z from "zod";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useTransition } from "react";

export default function CommentSection() {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<"posts"> }>();
  const createComments = useMutation(api.comments.createComments);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    try {
      await createComments(data);
      form.reset();
      toast.success("Comment posted");
    } catch (error) {
      toast.error("Failed to Comments");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">5 Comments</h2>
      </CardHeader>

      {/* cardcontent */}

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Share your thoughts</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thought"
                  {...field}
                />
              </Field>
            )}
          />
          <Button
            type="submit"
            className="mt-4 w-full cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="animate-spin mr-2" />
                <span>Commenting...</span>
              </>
            ) : (
              <span>Post Comment</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
