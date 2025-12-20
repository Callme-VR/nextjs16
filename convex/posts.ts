import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

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


export const getPostById = query({
     args: {
          postId: v.id("posts"),
     },
     handler: async (ctx, args) => {
          const post = await ctx.db.get(args.postId);

          if (!post) {
               return null;
          }

          const imageUrl = post.imageStorageId !== undefined
               ? await ctx.storage.getUrl(post.imageStorageId)
               : null;

          return {
               ...post,
               imageUrl
          };
     }
})



interface SearchResultTypes{
     id: string,
     title:string
     body:string
}




export const searchPost = query({
     args: {
          term: v.string(),
          limit: v.number(),
     },
     handler: async (ctx, args) => {
          const limit = args.limit;
          const result: SearchResultTypes[] = [];
          const seen = new Set();
          
          const pushdocs = async (docs: Array<Doc<"posts">>) => {
               for (const doc of docs) {
                    if (seen.has(doc._id)) continue;
                    seen.add(doc._id);
                    result.push({
                         id: doc._id,
                         title: doc.title,
                         body: doc.body,
                    });
                    if (result.length >= limit) break;
               }
          };

          const titleMatches = await ctx.db
               .query("posts")
               .withSearchIndex("search_title", (q) => q.search("title", args.term))
               .take(limit);
          
          await pushdocs(titleMatches);
          
          if (result.length < limit) {
               const bodyMatches = await ctx.db
                    .query("posts")
                    .withSearchIndex("search_body", (q) => q.search("body", args.term))
                    .take(limit - result.length);
               
               await pushdocs(bodyMatches);
          }

          return result;
     }
})