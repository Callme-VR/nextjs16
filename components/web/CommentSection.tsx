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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { useTransition } from "react";
import { Separator } from "../ui/separator";






export default function CommentSection() {

  const params = useParams<{ postId: Id<"posts"> }>();
  const data = useQuery(api.comments.getCommentsbyPostId, { postId: params.postId })




  const [isPending, startTransition] = useTransition();
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
      toast.error("Failed to post comment");
    }
  };


  if (data === undefined) {
    return <div>
      <p>
        Loading...
      </p>
    </div>
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{data?.length || 0} Comments</h2>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Share your thoughts</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts..."
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

        {data.length > 0 && <Separator />}

        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString(
                      "en-US"
                    )}
                  </p>
                </div>

                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>

      </CardContent>
    </Card>
  );
}
