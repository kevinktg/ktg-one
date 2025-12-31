"use client";

export function BlogPreview({ posts = [] }) {
  return (
    <section className="relative min-h-screen py-32 px-6 bg-background" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        <h2 className="font-syne text-4xl font-bold mb-6 lowercase">Blog</h2>
        {posts && posts.length > 0 ? (
          <p className="text-muted-foreground">{posts.length} posts loaded</p>
        ) : (
          <p className="text-muted-foreground">No posts available</p>
        )}
      </div>
    </section>
  );
}

