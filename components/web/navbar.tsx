import Link from "next/link";

export default function Navbar() {
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
                    <Link href={"/"}>Home</Link>
                    <Link href={"/Blog"}>Blog</Link>
                    <Link href={"/create"}>Create</Link>

                </div>
            </div>

            {/*  */}








        </nav>
    )
}