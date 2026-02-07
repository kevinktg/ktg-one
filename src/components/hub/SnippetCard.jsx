"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SnippetCard({ snippet, content }) {
  // Truncate content for preview (first 150 chars)
  const truncatedContent = content && content.length > 150 
    ? content.slice(0, 150) + "..." 
    : content || "";

  return (
    <Link href={`/hub/snippets/${snippet.id}`} className="group block">
      <Card className="flex h-[200px] flex-col overflow-hidden bg-[#0a0a0a] transition-colors hover:border-muted-foreground/50">
        {/* Code preview section */}
        <div className="m-2 h-[100px] overflow-hidden rounded-md border border-border/50 bg-[#111111] p-3">
          <p className="font-mono text-xs leading-relaxed text-muted-foreground line-clamp-4">
            {truncatedContent}
          </p>
        </div>

        {/* Title and tags */}
        <CardHeader className="mt-auto p-3 pb-3">
          <CardTitle className="line-clamp-2">{snippet.title}</CardTitle>
          <CardContent className="p-0 pt-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {snippet.snippet_type && (
                <Badge variant="outline" className="text-xs">
                  {snippet.snippet_type}
                </Badge>
              )}
              {snippet.tags && snippet.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {snippet.tags && snippet.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">+{snippet.tags.length - 2} more</span>
              )}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </Link>
  );
}
