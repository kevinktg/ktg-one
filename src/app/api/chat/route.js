import { gateway } from '@ai-sdk/gateway';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  // Use Vercel AI Gateway for multi-provider model access
  // Supports OpenAI, Anthropic, Google, xAI, Mistral, etc.
  // Configure provider keys in Vercel Dashboard > AI Gateway settings
  const result = streamText({
    model: gateway('openai/gpt-4o-mini'),
    messages,
    system: `You are a helpful AI assistant for .ktg's portfolio.
You answer questions about the portfolio, prompt engineering techniques, and RAG architectures.
Keep answers concise and technical.`,
  });

  return result.toDataStreamResponse();
}
