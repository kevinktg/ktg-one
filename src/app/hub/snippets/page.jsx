"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SnippetCard } from "@/components/hub/SnippetCard";
import { getSnippetContent } from "@/lib/snippets/storage";

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [snippetsWithContent, setSnippetsWithContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSnippets();
  }, []);

  useEffect(() => {
    // Fetch content previews for cards
    const fetchContents = async () => {
      const withContent = await Promise.all(
        snippets.map(async (snippet) => {
          try {
            const content = await getSnippetContent(snippet.blob_url);
            return { ...snippet, content };
          } catch (error) {
            return { ...snippet, content: "" };
          }
        })
      );
      setSnippetsWithContent(withContent);
    };

    if (snippets.length > 0) {
      fetchContents();
    }
  }, [snippets]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hub/snippets");
      if (response.ok) {
        const data = await response.json();
        setSnippets(data);
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-syne font-bold lowercase mb-4">KTG Snippets</h1>
          <p className="text-muted-foreground">
            Browse KTG v30 framework snippets and techniques
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[200px] bg-[#0a0a0a] border border-border animate-pulse rounded-lg" />
            ))}
          </div>
        ) : snippets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No snippets available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippetsWithContent.length > 0 
              ? snippetsWithContent.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} content={snippet.content} />
                ))
              : snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} content="" />
                ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
