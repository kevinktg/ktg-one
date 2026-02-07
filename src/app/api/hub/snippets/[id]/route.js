import { NextResponse } from "next/server";
import { getSnippetById } from "@/lib/snippets/queries";
import { getSnippetContent } from "@/lib/snippets/storage";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const snippet = await getSnippetById(id);

    if (!snippet) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    // Fetch content from Blob
    const content = await getSnippetContent(snippet.blob_url);

    return NextResponse.json({
      ...snippet,
      content,
    });
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 }
    );
  }
}
