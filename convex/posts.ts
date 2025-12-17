import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { authComponent } from "./auth";

export const CreatePost = mutation({
     args: { title: v.string(), body: v.string() },
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
               })
          return blogAtricle;
     }
})