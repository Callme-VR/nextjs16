import z from "zod";

export const POST_SCHEMA=z.object({
     title:z.string().min(3).max(100),
     content:z.string().min(3).max(1000),
})
