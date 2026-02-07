"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SnippetViewer } from "@/components/hub/SnippetViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SnippetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [snippet, setSnippet] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSnippet(params.id);
    }
  }, [params.id]);

  const fetchSnippet = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hub/snippets/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSnippet(data);
        setContent(data.content || "");
      } else if (response.status === 404) {
        router.push("/hub/snippets");
      }
    } catch (error) {
      console.error("Error fetching snippet:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted animate-pulse rounded-sm mb-4" />
          <div className="h-64 bg-muted animate-pulse rounded-sm" />
        </div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">Snippet not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/hub/snippets"
          className="mb-8 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to snippets
        </Link>
        <SnippetViewer snippet={snippet} content={content} />
      </div>
    </div>
  );
}
