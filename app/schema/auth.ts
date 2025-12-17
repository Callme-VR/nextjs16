import z, { email } from "zod";

export const SignupSchema=z.object({
    name:z.string().min(3).max(30),
    email:z.string().email(),
    password:z.string().min(8).max(20)
})

export const loginSchema=z.object({
    email:z.email(),
    password:z.string().min(8).max(20)
})