import { NextResponse } from "next/server";
import { getAllSnippets, createSnippet } from "@/lib/snippets/queries";
import { uploadSnippet } from "@/lib/snippets/storage";

export async function GET() {
  try {
    const snippets = await getAllSnippets();
    return NextResponse.json(snippets);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, content, tags, snippet_type, source_file } = body;

    if (!title || !content || !source_file) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, source_file" },
        { status: 400 }
      );
    }

    // Upload content to Blob
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}.md`;
    const blob = await uploadSnippet(filename, content);

    // Create snippet record
    const snippet = await createSnippet({
      title,
      description,
      blob_url: blob.url,
      tags: tags || [],
      snippet_type,
      source_file,
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error("Error creating snippet:", error);
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}
