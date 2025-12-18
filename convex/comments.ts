import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsbyPostId = query({
     // like if we want to get the thing from db we just have to pass args i  this convex backend for macthching the like ,if user want to comment i first i need the postid
     args: {
          postId: v.id("posts")
     },
     handler: async (ctx, args) => {
          const data = await ctx.db.query("comments")
               .filter(q => q.eq(q.field("postId"), args.postId))
               .order("desc")
               .collect();
          return data;
     }
})

export const createComments = mutation({
     args: {
          body: v.string(),
          postId: v.id("posts"),
     },
     handler: async (ctx, args) => {
          const user = await authComponent.safeGetAuthUser(ctx);
          if (!user) {
               throw new ConvexError("not authorized")
          }
          return await ctx.db.insert("comments", {
               postId: args.postId,
               body: args.body,
               authorId: user._id,
               authorName: user.name,
          })
     }
})