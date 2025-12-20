import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const result = useQuery(api.posts.searchPost, {
    term,
    limit: 5,
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
  }

  useEffect(() => {
    setOpen(term.length > 2);
  }, [term]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="w-full bg-background pl-7"
          placeholder="Search Posts"
          type="search"
          value={term}
          onChange={handleInputChange}
        />
      </div>
      {open && term.length > 2 && (
        <div className="absolute top-full mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 z-50">
          {result === undefined ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : result.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No results found
            </p>
          ) : (
            <div className="py-1">
              {result.map((post) => (
                <Link
                  href={`/blog/${post.id}`}
                  key={post.id}
                  className="block px-4 py-2 hover:bg-accent transition-colors"
                  onClick={() => {
                    setOpen(false);

                    setTerm("");
                  }}
                >
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {post.body}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
