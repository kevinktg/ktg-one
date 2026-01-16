import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  // 1. Get the messages from the request body
  const { messages } = await req.json();

  // 2. Stream the response from the model
  // Note: This requires OPENAI_API_KEY in environment variables
  // Once configured, this endpoint will power the 'AI Playground' in ToolsSection
  /*
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are a helpful AI assistant for .ktg's portfolio.
             You answer questions about the portfolio, prompt engineering techniques, and RAG architectures.
             Keep answers concise and technical.`,
  });

  return result.toDataStreamResponse();
  */

  // Fallback response until keys are configured
  return new Response(
    JSON.stringify({
      error: "AI SDK not configured. Please add OPENAI_API_KEY to .env.local"
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );
}
