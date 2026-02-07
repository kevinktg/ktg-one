"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function SnippetViewer({ snippet, content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with title and copy button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-syne font-bold lowercase mb-2">{snippet.title}</h1>
          {snippet.description && (
            <p className="text-muted-foreground mb-4">{snippet.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {snippet.snippet_type && (
              <Badge variant="outline">{snippet.snippet_type}</Badge>
            )}
            {snippet.tags && snippet.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Source: {snippet.source_file}</p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Content display */}
      <Card className="min-h-[600px] bg-[#0a0a0a]">
        <div className="flex items-center justify-end border-b border-border px-4 py-3">
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardContent className="h-[calc(100%-49px)] overflow-auto p-6">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {copied && (
        <Card className="px-4 py-2.5">
          <CardContent className="p-0 text-[13px] text-foreground">
            Snippet copied to clipboard
          </CardContent>
        </Card>
      )}
    </div>
  );
}
