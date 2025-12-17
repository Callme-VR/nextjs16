"use client";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "../providers/theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();


  const router=useRouter();
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8 ">
        {/* for link into home page */}
        <Link href={"/"}>
          <h1 className="text-2xl font-bold text-primary">
            Bloger <span className="text-green-600">Blog</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "ghost" })} href={"/"}>
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href={"/Blog"}>
            Blog
          </Link>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={"/create"}
          >
            Create
          </Link>
        </div>
      </div>

      {/* for login and register button */}

      <div className="flex items-center gap-2">
        {isLoading ? null : isAuthenticated ? (
          <Button onClick={()=>authClient.signOut({
            fetchOptions:{
                onSuccess:()=>{
                    toast.success("Logged out successFully")
                    router.push("/")
                },
                onError:()=>{
                    toast.error("Failed to log out")
                }
            }
          })}>Logout</Button>
        ) : (
          <>
            {" "}
            <Link className={buttonVariants()} href={"/sign-up"}>
              Signup
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={"/login"}
            >
              Login
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
