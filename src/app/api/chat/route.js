// Placeholder route - not yet configured
export async function POST() {
  return new Response(
    JSON.stringify({
      error: "AI SDK not configured. Please add OPENAI_API_KEY to .env.local"
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );
}
