"use client"
import { SignupSchema } from "@/app/schema/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { ZodObject, ZodString } from "zod"
import { $strip } from "zod/v4/core"

export default function SignupPage() {

    const form=useForm({
        resolver:zodResolver(SignupSchema),
        defaultValues:{
            name:"",
            email:"",
            password:""
        }
    })





    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create An account to get Started </CardDescription>

                <CardContent>
                    <form
                    ></form>
                </CardContent>
            </CardHeader>
        </Card>
    )
}

function zodResolver(SignupSchema: ZodObject<{ name: ZodString; email: ZodString; password: ZodString }, $strip>): import("react-hook-form").Resolver<import("react-hook-form").FieldValues, any, import("react-hook-form").FieldValues> | undefined {
    throw new Error("Function not implemented.")
}
