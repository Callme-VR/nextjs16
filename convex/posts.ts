import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const CreatePost = mutation({
     args: { title: v.string(), body: v.string(), imageStorageId: v.optional(v.id("_storage")) },
     handler: async (ctx, args) => {

          const user = await authComponent.safeGetAuthUser(ctx);
          if (!user) {
               throw new Error("Unauthorized")
          }
          const blogAtricle = await ctx.db.insert
               ("posts", {
                    title: args.title,
                    body: args.body,
                    authorId: user._id,
                    imageStorageId: args.imageStorageId,
               })
          return blogAtricle;
     }
})

export const getposts = query({
     args: {},
     handler: async (ctx) => {
          const posts = await ctx.db.query("posts").order("desc").collect();
          return await Promise.all(
               posts.map(async (post) => {
                    const imageUrl = post.imageStorageId !== undefined
                         ? await ctx.storage.getUrl(post.imageStorageId)
                         : null;

                    return {
                         ...post,
                         imageUrl
                    };
               })
          );
     }
})

// for getting image url from s3
export const generateImageUploadUrl = mutation({
     args: {},
     handler: async (ctx) => {
          const user = await authComponent.safeGetAuthUser(ctx);

          if (!user) {
               throw new ConvexError("not authorized   ")
          }

          return await ctx.storage.generateUploadUrl();

     }
})